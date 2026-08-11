import { Module } from '@nestjs/common';
import { TurmcodeService } from './turmcode.service';
import { TurmcodeController } from './turmcode.controller';

@Module({
  controllers: [TurmcodeController],
  providers: [TurmcodeService],
})
export class TurmcodeModule {}
