import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { KeyStrategy } from './key.strategy';

import { UsersModule } from '../amec/users/users.module';
import { AppsusersModule } from '../docinv/appsusers/appsusers.module';
import { AppsmenuusersModule } from '../docinv/appsmenuusers/appsmenuusers.module';
import { AccesslogModule } from '../docinv/accesslog/accesslog.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    AppsusersModule,
    AppsmenuusersModule,
    AccesslogModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, KeyStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
