import { Module } from '@nestjs/common';
import { F002kpService } from './f002kp.service';
import { F002kpController } from './f002kp.controller';

@Module({
  controllers: [F002kpController],
  providers: [F002kpService],
})
export class F002kpModule {}
