import { Module } from '@nestjs/common';
import { MatrixSectionService } from './matrix-section.service';
import { MatrixSectionController } from './matrix-section.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatrixSection } from './entities/matrix-section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatrixSection], 'idsConnection')],
  controllers: [MatrixSectionController],
  providers: [MatrixSectionService],
  exports: [MatrixSectionService],
})
export class MatrixSectionModule {}
