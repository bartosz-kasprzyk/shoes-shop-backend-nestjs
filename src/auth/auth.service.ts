import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  SignupDto,
  SigninDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerServiceImplementation } from 'src/mailer/mailer.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailerService: MailerServiceImplementation,
  ) {}

  async signup(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const token = uuidv4();

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          password: hash,
          confirmationToken: token,
          isConfirmed: false,
        },
      });

      this.mailerService
        .sendConfirmationEmail(user.email, token)
        .catch((err) => {
          console.error('Email failed to send, but user was created:', err);
        });

      return {
        message: 'Success! Please check your email to activate your account.',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async confirmEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { confirmationToken: token },
    });

    if (!user) throw new ForbiddenException('Invalid or expired token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isConfirmed: true,
        confirmationToken: null,
      },
    });

    return { message: 'Email confirmed! You can now log in.' };
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.identifier,
      },
      include: {
        avatar: true,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');
    if (!user.isConfirmed) {
      throw new ForbiddenException(
        'Please confirm your email before logging in',
      );
    }

    const pwMatches = await bcrypt.compare(dto.password, user.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    const tokenObj = await this.signToken(user.id, user.email);

    return {
      jwt: tokenObj.jwt,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar
          ? {
              url: user.avatar.url,
            }
          : null,
      },
    };
  }

  async signToken(userId: number, email: string): Promise<{ jwt: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret,
    });

    return { jwt: token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000);

    await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    this.mailerService
      .sendPasswordResetEmail(user.email, token)
      .catch((err) => {
        console.error('Email failed to send, but user was created:', err);
      });

    return { message: 'Reset email sent!' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.code,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) throw new ForbiddenException('Invalid or expired token');

    const hash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return { message: 'Password successfully updated!' };
  }
}
