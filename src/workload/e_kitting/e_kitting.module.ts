import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V_Q141KP_KITTING_LIST } from 'src/common/Entities/workload/views/V_Q141KP_KITTING_LIST.entity';
import { EKittingMasterDwg } from 'src/common/Entities/workload/table/EKITTING_MASTER_DWG.entity';
import { EKittingService } from './e_kitting.service';
import { EKittingController } from './e_kitting.controller';
import { EKittingRepository } from './e_kitting.repository';

@Module({
  imports: [TypeOrmModule.forFeature([V_Q141KP_KITTING_LIST,EKittingMasterDwg], 'mitsuConnection')],
  controllers: [EKittingController],
  providers: [EKittingService, EKittingRepository],
})
export class EKittingModule {}
