import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerServiceImplementation {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    const url = `http://localhost:3000/api/auth/local/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your Shoes Shop account! 👟',
      template: './confirmation',
      context: { url },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `http://localhost:3000/api/auth/local/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password - Shoes Shop',
      template: './reset-password',
      context: { url },
    });
  }
}
