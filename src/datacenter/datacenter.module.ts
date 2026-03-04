import { Module } from '@nestjs/common';
import { F110kpModule } from './f110kp/f110kp.module';
import { S011mpModule } from './s011mp/s011mp.module';

@Module({
  imports: [F110kpModule, S011mpModule],
})
export class DatacenterModule {}
