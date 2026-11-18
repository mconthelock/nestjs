import { Module } from '@nestjs/common';
import { VpsService } from './vps.service';
import { VpsController } from './vps.controller';
import { VpsRepository } from './vps.repository';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { S011mpModule } from 'src/datacenter/s011mp/s011mp.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PKC_CARTON_DETAIL } from 'src/common/Entities/workload/table/PKC_CARTON_DETAIL.entity';

@Module({
    controllers: [VpsController],
    imports: [
        TypeOrmModule.forFeature([
        PKC_CARTON_DETAIL,
    ], 'mitsuConnection'),ConectionModule, S011mpModule, MailModule],
    providers: [VpsService, VpsRepository],
})
export class VpsModule {}
