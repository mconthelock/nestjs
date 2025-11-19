import { Module } from '@nestjs/common';
import { MatrixEffectViewModule } from './matrix/matrix-effect-view/matrix-effect-view.module';
import { MatrixEffectItemModule } from './matrix/matrix-effect-item/matrix-effect-item.module';
import { MatrixItemMasterModule } from './matrix/matrix-item-master/matrix-item-master.module';
import { MatrixSectionModule } from './matrix/matrix-section/matrix-section.module';
import { MatrixManualModule } from './matrix/matrix-ads/matrix-manual.module';

@Module({
  imports: [
    MatrixItemMasterModule,
    MatrixSectionModule,
    MatrixEffectItemModule,
    MatrixEffectViewModule,
    MatrixManualModule,
  ],
})
export class IdsModule {}
