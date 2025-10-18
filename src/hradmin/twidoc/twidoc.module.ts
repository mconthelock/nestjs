import { Module } from '@nestjs/common';
import { TwidocService } from './twidoc.service';
import { TwidocController } from './twidoc.controller';

@Module({
  controllers: [TwidocController],
  providers: [TwidocService],
})
export class TwidocModule {}
