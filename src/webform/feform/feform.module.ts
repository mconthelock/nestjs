import { Module } from '@nestjs/common';
import { FeFileModule } from './fe-file/fe-file.module';

@Module({
  imports: [FeFileModule]
})
export class FeformModule {}
