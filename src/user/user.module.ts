import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
