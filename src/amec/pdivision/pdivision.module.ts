import { Module } from '@nestjs/common';
import { PdivisionService } from './pdivision.service';
import { PdivisionController } from './pdivision.controller';

@Module({
  controllers: [PdivisionController],
  providers: [PdivisionService],
})
export class PdivisionModule {}
