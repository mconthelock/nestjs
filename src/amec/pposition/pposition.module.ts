import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PpositionService } from './pposition.service';
import { PPOSITION } from 'src/common/Entities/amec/table/PPOSITION.entity';
import { PpositionController } from './pposition.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PPOSITION], 'webformConnection')],
  controllers: [PpositionController],
  providers: [PpositionService],
})
export class PpositionModule {}
