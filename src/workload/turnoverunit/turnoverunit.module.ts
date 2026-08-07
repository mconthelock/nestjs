import { Module } from '@nestjs/common';
import { TurnoverunitService } from './turnoverunit.service';
import { TurnoverunitController } from './turnoverunit.controller';

@Module({
  controllers: [TurnoverunitController],
  providers: [TurnoverunitService],
})
export class TurnoverunitModule {}
