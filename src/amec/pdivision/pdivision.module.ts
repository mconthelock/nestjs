import { Module } from '@nestjs/common';
import { PdivisionService } from './pdivision.service';
import { PdivisionController } from './pdivision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pdivision } from './entities/pdivision.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pdivision], 'amecConnection')],
  controllers: [PdivisionController],
  providers: [PdivisionService],
})
export class PdivisionModule {}
