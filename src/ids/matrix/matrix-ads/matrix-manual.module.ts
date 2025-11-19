import { Module } from '@nestjs/common';
import { MatrixManualService } from './matrix-manual.service';
import { MatrixManualController } from './matrix-manual.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatrixManual } from './entities/matrix-manual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatrixManual], 'idsConnection')],
  controllers: [MatrixManualController],
  providers: [MatrixManualService],
  exports: [MatrixManualService],
})
export class MatrixManualModule {}
