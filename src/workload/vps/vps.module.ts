import { Module } from '@nestjs/common';
import { VpsService } from './vps.service';
import { VpsController } from './vps.controller';
import { VpsRepository } from './vps.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { S011mpModule } from 'src/datacenter/s011mp/s011mp.module';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    controllers: [VpsController],
    imports: [ConectionModule, S011mpModule, MailModule],
    providers: [VpsService, VpsRepository],
})
export class VpsModule {}
