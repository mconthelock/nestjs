import { Module } from '@nestjs/common';
import { MatrixEffectItemService } from './matrix-effect-item.service';
import { MatrixEffectItemController } from './matrix-effect-item.controller';
import { MatrixEffectItem } from './entities/matrix-effect-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MatrixEffectItem], 'idsConnection')],
  controllers: [MatrixEffectItemController],
  providers: [MatrixEffectItemService],
  exports: [MatrixEffectItemService],
})
export class MatrixEffectItemModule {}
