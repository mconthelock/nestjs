import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { KeyStrategy } from './key.strategy';

import { UsersModule } from '../amec/users/users.module';
import { AppsusersModule } from '../docinv/appsusers/appsusers.module';
import { AppsmenuusersModule } from '../docinv/appsmenuusers/appsmenuusers.module';
import { AccesslogModule } from '../docinv/accesslog/accesslog.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { SequenceOrgModule } from 'src/webform/sequence-org/sequence-org.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { PasswordTokens } from 'src/common/Entities/webform/table/PASSWORD_RESET_TOKENS.entity';

@Module({
    imports: [
        UsersModule,
        AppsusersModule,
        AppsmenuusersModule,
        AccesslogModule,
        PassportModule,
        MailModule,
        SequenceOrgModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '60m' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([PasswordTokens], 'webformConnection'),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy, KeyStrategy],
    controllers: [AuthController],
    exports: [JwtModule],
})
export class AuthModule {}
