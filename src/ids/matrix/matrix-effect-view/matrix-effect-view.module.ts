import { Module } from '@nestjs/common';
import { MatrixEffectViewService } from './matrix-effect-view.service';
import { MatrixEffectViewController } from './matrix-effect-view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatrixEffectView } from './entities/matrix-effect-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatrixEffectView], 'idsConnection')],
  controllers: [MatrixEffectViewController],
  providers: [MatrixEffectViewService],
  exports: [MatrixEffectViewService],
})
export class MatrixEffectViewModule {}
