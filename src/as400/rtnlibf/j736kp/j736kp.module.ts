import { Module } from '@nestjs/common';
import { J736kpService } from './j736kp.service';
import { J736kpController } from './j736kp.controller';

@Module({
  controllers: [J736kpController],
  providers: [J736kpService],
})
export class J736kpModule {}
