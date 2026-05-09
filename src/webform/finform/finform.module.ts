import { Module } from '@nestjs/common';
import { FinDsModule } from './fin-ds/fin-ds.module';
import { FinFileModule } from './fin-file/fin-file.module';

@Module({
  imports: [FinDsModule, FinFileModule]
})
export class FinformModule {}
