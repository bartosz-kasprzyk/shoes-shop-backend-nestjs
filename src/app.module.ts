import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { ColorsModule } from './colors/colors.module';
import { SizesModule } from './sizes/sizes.module';
import { CategoriesModule } from './categories/categories.module';
import { GendersModule } from './genders/genders.module';

@Module({
  imports: [ProductsModule, PrismaModule, BrandsModule, ColorsModule, SizesModule, CategoriesModule, GendersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
