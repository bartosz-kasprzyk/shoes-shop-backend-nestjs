import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto } from './dto';

@Controller('api/auth/local')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('confirm')
  confirm(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }
}
