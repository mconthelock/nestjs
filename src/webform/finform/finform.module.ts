import { Module } from '@nestjs/common';
import { FinDsModule } from './fin-ds/fin-ds.module';

@Module({
  imports: [FinDsModule]
})
export class FinformModule {}
