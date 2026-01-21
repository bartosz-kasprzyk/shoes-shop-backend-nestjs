import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupDto, SigninDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    const [firstName, ...rest] = dto.fullName.trim().split(' ');
    const lastName = rest.join(' ');

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.email,
          firstName: firstName,
          lastName: lastName,
          password: hash,
        },
      });

      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await bcrypt.compare(dto.password, user.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    delete user.password;
    return user;
  }
}
