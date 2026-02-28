import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerServiceImplementation } from './mailer.service';
import { join } from 'path';

@Module({
  imports: [],
  providers: [MailerServiceImplementation],
  exports: [MailerServiceImplementation],
})
export class CustomMailerModule {}
