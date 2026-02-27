import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerServiceImplementation {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3333';
    const url = `${backendUrl}/api/auth/local/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your Shoes Shop account! 👟',
      template: './confirmation',
      context: { url },
    });
  }

  async sendPasswordResetEmail(email: string, code: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password - Shoes Shop',
      template: './reset-password',
      context: { url }
    });
  }
}
