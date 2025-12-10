import { Module } from '@nestjs/common';
import { IsAdpService } from './is-adp.service';
import { IsAdpController } from './is-adp.controller';

@Module({
  controllers: [IsAdpController],
  providers: [IsAdpService],
})
export class IsAdpModule {}
