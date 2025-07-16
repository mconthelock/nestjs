import { Module } from '@nestjs/common';
import { RatioService } from './ratio.service';
import { RatioController } from './ratio.controller';

@Module({
  controllers: [RatioController],
  providers: [RatioService],
})
export class RatioModule {}
