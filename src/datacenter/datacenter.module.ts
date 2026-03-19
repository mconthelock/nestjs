import { Module } from '@nestjs/common';
import { F110kpModule } from './f110kp/f110kp.module';
import { S011mpModule } from './s011mp/s011mp.module';
import { F001kpModule } from './f001kp/f001kp.module';
import { F002kpModule } from './f002kp/f002kp.module';

@Module({
  imports: [F110kpModule, S011mpModule, F001kpModule, F002kpModule],
})
export class DatacenterModule {}
