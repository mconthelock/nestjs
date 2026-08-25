import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MfgEdrTargetMaster } from '../../../../common/Entities/webform/table/mfg_edr_target_master.entity';
import { MfgEdrTargetMasterController } from './mfg_edr_target_master.controller';
import { MfgEdrTargetMasterService } from './mfg_edr_target_master.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [MfgEdrTargetMaster],
      'webformConnection',
    ),
  ],
  controllers: [MfgEdrTargetMasterController],
  providers: [MfgEdrTargetMasterService],
  exports: [MfgEdrTargetMasterService],
})
export class MfgEdrTargetMasterModule {}