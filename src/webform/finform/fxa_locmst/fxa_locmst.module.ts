import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxaLocmstService } from './fxa_locmst.service';
import { FXALOCMSTRepository } from './fxa_locmst.repository';
import { FxaLocmstController } from './fxa_locmst.controller';
import { FXA_LOCMST } from 'src/common/Entities/webform/table/FXA_LOCMST.entity';
import { VORGMST } from 'src/common/Entities/webform/views/VORGMST.entity';
import { PPOSITION } from 'src/common/Entities/amec/table/PPOSITION.entity';

@Module({
  imports: [
    // อย่าลืมเอา Entity หลักไปใส่ใน TypeOrmModule เพื่อให้ Repository ทำงานได้
    TypeOrmModule.forFeature([FXA_LOCMST , PPOSITION, VORGMST], 'webformConnection'),
  ],
  controllers: [FxaLocmstController],
  providers: [FxaLocmstService , FXALOCMSTRepository ],
  exports: [FXALOCMSTRepository],

})
export class FxaLocmstModule {}
