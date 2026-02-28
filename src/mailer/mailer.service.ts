import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { join } from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailerServiceImplementation {
  constructor() {}

  private async sendViaApi(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ) {
    try {
      const templatePath = join(
        process.cwd(),
        'dist/mailer/templates',
        `${templateName}.hbs`,
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Can't find the template in ${templatePath}`);
      }

      const source = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(source);
      const html = template(context);

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN as string,
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `From: "Shoes Shop" <${process.env.MAIL_USER}>`,
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        html,
      ];
      const message = messageParts.join('\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });

      console.log(`✅ Success! Mail [${subject}] sent to: ${to}`);
    } catch (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }

  async sendConfirmationEmail(email: string, token: string) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3333';
    const url = `${backendUrl}/api/auth/local/confirm?token=${token}`;

    await this.sendViaApi(
      email,
      'Activate your Shoes Shop account! 👟',
      'confirmation',
      { url },
    );
  }

  async sendPasswordResetEmail(email: string, code: string) {
    const url = `${process.env.FRONTEND_URL}/reset-password?code=${code}`;

    await this.sendViaApi(
      email,
      'Reset your password - Shoes Shop',
      'reset-password',
      { url },
    );
  }
}
