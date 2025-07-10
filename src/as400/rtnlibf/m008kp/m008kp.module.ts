import { Module } from '@nestjs/common';
import { M008kpService } from './m008kp.service';
import { M008kpController } from './m008kp.controller';

@Module({
  controllers: [M008kpController],
  providers: [M008kpService],
})
export class M008kpModule {}
