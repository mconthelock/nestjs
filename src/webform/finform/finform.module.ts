import { Module } from '@nestjs/common';
import { FinDsModule } from './fin-ds/fin-ds.module';
import { FinFileModule } from './fin-file/fin-file.module';
import { FinPckModule } from './fin-pck/fin-pck.module';
import { FxaLocmstModule } from './fxa_locmst/fxa_locmst.module';
import { FxaGrpmstModule } from './fxa_grpmst/fxa_grpmst.module';
import { FinpckFormModule } from './fin-pck/finpck_form/finpck_form.module';
import { FinpckAssetModule } from './fin-pck/finpck_asset/finpck_asset.module';


@Module({
  imports: [FinDsModule, FinFileModule, FinPckModule, FxaLocmstModule, FxaGrpmstModule , FinpckFormModule , FinpckAssetModule]
})
export class FinformModule {}
