import { Module } from '@nestjs/common';
import { MasterkeyService } from './masterkey.service';
import { MasterkeyController } from './masterkey.controller';

@Module({
  controllers: [MasterkeyController],
  providers: [MasterkeyService],
})
export class MasterkeyModule {}
