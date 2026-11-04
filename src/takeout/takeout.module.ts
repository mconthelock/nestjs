import { Module } from '@nestjs/common';
import { ZincPrModule } from './zinc-pr/zinc-pr.module';

@Module({
  imports: [ZincPrModule],
})
export class TakeoutModule {}