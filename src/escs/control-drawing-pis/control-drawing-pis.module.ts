import { Module } from '@nestjs/common';
import { ControlDrawingPisService } from './control-drawing-pis.service';
import { ControlDrawingPisController } from './control-drawing-pis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONTROL_DRAWING_PIS } from 'src/common/Entities/escs/table/CONTROL_DRAWING_PIS.entity';
import { ControlDrawingPisRepository } from './control-drawing-pis.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CONTROL_DRAWING_PIS], 'escsConnection')],
  controllers: [ControlDrawingPisController],
  providers: [ControlDrawingPisService, ControlDrawingPisRepository],
  exports: [ControlDrawingPisService],
})
export class ControlDrawingPisModule {}
