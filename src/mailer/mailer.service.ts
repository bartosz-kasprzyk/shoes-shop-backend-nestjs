import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerServiceImplementation {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationEmail(email: string, token: string) {
    console.log('--- DEBUG RENDERA ---');
    console.log('User:', process.env.MAIL_USER);
    console.log(
      'C-ID:',
      process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
    );
    console.log('Refresh Token obecny?:', !!process.env.GOOGLE_REFRESH_TOKEN);
    console.log('--- END DEBUG ---');
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3333';
    const url = `${backendUrl}/api/auth/local/confirm?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activate your Shoes Shop account! 👟',
        template: './confirmation',
        context: { url },
      });
      console.log('✅ Email sent successfully to:', email);
    } catch (error) {
      console.error('❌ MAILER ERROR:', error.message);
      // This will print the real reason in your terminal!
    }
  }

  async sendPasswordResetEmail(email: string, code: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password - Shoes Shop',
      template: './reset-password',
      context: { url },
    });
  }
}
