import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BcryptAdapter],
  imports: [
    ConfigModule,

    UsersModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ( configService: ConfigService ) => {
        // console.log({
        //   JWT_SECRET_FROM_configService: configService.get('JWT_SECRET')
        // })
        // console.log({ JWT_SECRET: process.env.JWT_SECRET })
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: {
    //     expiresIn: '2h'
    //   }
    // })
  ],
  exports: [PassportModule, BcryptAdapter]
})
export class AuthModule {}
