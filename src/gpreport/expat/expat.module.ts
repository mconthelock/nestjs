import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpatController } from './expat.controller';
import { ExpatService } from './expat.service';
import { ExpatRepository } from './expat.repository';
import { User } from 'src/amec/users/entities/user.entity';
import { MailModule } from 'src/common/services/mail/mail.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([User], 'gpreportConnection'),
        MailModule,
    ],
    controllers: [ExpatController],
    providers: [ExpatService, ExpatRepository],
    exports: [ExpatService, ExpatRepository],
})
export class ExpatModule {}