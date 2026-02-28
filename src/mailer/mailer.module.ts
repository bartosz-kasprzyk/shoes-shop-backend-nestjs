import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerServiceImplementation } from './mailer.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"Shoes Shop" <bartosz.kasprzyk58@gmail.com>',
      },
      template: {
        dir: join(process.cwd(), 'dist/mailer/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailerServiceImplementation],
  exports: [MailerServiceImplementation],
})
export class CustomMailerModule {}
