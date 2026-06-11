import { Module } from '@nestjs/common';
import { F110kpModule } from './f110kp/f110kp.module';
import { S011mpModule } from './s011mp/s011mp.module';
import { F001kpModule } from './f001kp/f001kp.module';
import { F002kpModule } from './f002kp/f002kp.module';
import { M001KpbmModule } from './m001-kpbm/m001-kpbm.module';
import { S020kpModule } from './s020kp/s020kp.module';
import { S049kpModule } from './s049kp/s049kp.module';

@Module({
  imports: [F110kpModule, S011mpModule, F001kpModule, F002kpModule, M001KpbmModule, S020kpModule, S049kpModule],
})
export class DatacenterModule {}
