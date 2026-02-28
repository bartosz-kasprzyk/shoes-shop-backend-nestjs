import { Module } from '@nestjs/common';
import { MailerServiceImplementation } from './mailer.service';

@Module({
  imports: [],
  providers: [MailerServiceImplementation],
  exports: [MailerServiceImplementation],
})
export class CustomMailerModule {}
