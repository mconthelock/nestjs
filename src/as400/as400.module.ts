import { Module } from '@nestjs/common';
import { F001kpModule } from './shopf/f001kp/f001kp.module';
import { F002kpModule } from './shopf/f002kp/f002kp.module';
import { F003kpModule } from './shopf/f003kp/f003kp.module';
import { ConectionModule } from './conection/conection.module';
import { Q90010p2Module } from './rtnlibf/q90010p2/q90010p2.module';
import { M008kpModule } from './rtnlibf/m008kp/m008kp.module';
import { Q141kpModule } from './rtnlibf/q141kp/q141kp.module';

@Module({
  imports: [
    ConectionModule,
    F001kpModule,
    F002kpModule,
    F003kpModule,
    Q90010p2Module,
    M008kpModule,
    Q141kpModule,
  ],
})
export class AS400Module {}
