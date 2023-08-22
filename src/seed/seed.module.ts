import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, ProductsModule, UsersModule]
})
export class SeedModule {}
