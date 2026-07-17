import { Module } from '@nestjs/common';
import { FinDsModule } from './fin-ds/fin-ds.module';
import { FinFileModule } from './fin-file/fin-file.module';
import { FinPckModule } from './fin-pck/fin-pck.module';
import { FxaLocmstModule } from './fxa_locmst/fxa_locmst.module';
import { FxaGrpmstModule } from './fxa_grpmst/fxa_grpmst.module';
import { FinNpoModule } from './fin-npo/fin-npo.module';

@Module({
  imports: [FinDsModule, FinNpoModule, FinFileModule, FinPckModule, FxaLocmstModule, FxaGrpmstModule]
})
export class FinformModule {}
