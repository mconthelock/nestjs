import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PpositionService } from './pposition.service';
import { Pposition } from './entities/pposition.entity';
import { PpositionController } from './pposition.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pposition], 'webformConnection')],
  controllers: [PpositionController],
  providers: [PpositionService],
})
export class PpositionModule {}
