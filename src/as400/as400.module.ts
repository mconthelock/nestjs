import { Module } from '@nestjs/common';
import { F001kpModule } from './shopf/f001kp/f001kp.module';
import { F002kpModule } from './shopf/f002kp/f002kp.module';
import { F003kpModule } from './shopf/f003kp/f003kp.module';
import { ConectionModule } from './conection/conection.module';

@Module({
  imports: [F001kpModule, F002kpModule, F003kpModule, ConectionModule],
})
export class AS400Module {}
