import { Module } from '@nestjs/common';
import { FinPckService } from './fin-pck.service';
import { FinPckController } from './fin-pck.controller';

@Module({
  controllers: [FinPckController],
  providers: [FinPckService],
})
export class FinPckModule {}
