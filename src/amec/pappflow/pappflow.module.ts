import { Module } from '@nestjs/common';
import { PappflowService } from './pappflow.service';
import { PappflowController } from './pappflow.controller';
import { PAPPFLOW } from 'src/common/Entities/amec/table/PAPPFLOW.entity';
import { PAPPSTEP } from 'src/common/Entities/amec/table/PAPPSTEP.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PAPPFLOW, PAPPSTEP], 'webformConnection')],
  controllers: [PappflowController],
  providers: [PappflowService],
  exports: [PappflowService],
})
export class PappflowModule {}
