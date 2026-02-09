import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CustomMailerModule } from './mailer/mailer.module';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { ColorsModule } from './colors/colors.module';
import { SizesModule } from './sizes/sizes.module';
import { CategoriesModule } from './categories/categories.module';
import { GendersModule } from './genders/genders.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CustomMailerModule,
    ProductsModule, 
    BrandsModule, 
    ColorsModule,
    SizesModule,
    CategoriesModule,
    GendersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
