import { Module } from '@nestjs/common';
import { DpmsPlMailService } from './dpms_pl_mail.service';
import { DpmsPlMailController } from './dpms_pl_mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_MAIL } from 'src/common/Entities/workload/table/DPMS_PL_MAIL.entity';
import { DpmsPlMailRepository } from './dpms_pl_mail.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DPMS_PL_MAIL], 'workloadConnection')],
    controllers: [DpmsPlMailController],
    providers: [DpmsPlMailService, DpmsPlMailRepository],
    exports: [DpmsPlMailService],
})
export class DpmsPlMailModule {}
