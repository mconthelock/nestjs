import { Module } from '@nestjs/common';
import { k089kpModule } from './k089kp/k089kp.module';
import { Q90010p2Module } from './q90010p2/q90010p2.module';
import { M008kpModule } from './m008kp/m008kp.module';
import { Q141kpModule } from './q141kp/q141kp.module';
import { T016kpModule } from './t016kp/t016kp.module';
import { R027mp1Module } from './r027mp1/r027mp1.module';
import { S026kpModule } from './s026kp/s026kp.module';
import { S030kpModule } from './s030kp/s030kp.module';
import { S001kpModule } from './s001kp/s001kp.module';
import { M001kpModule } from './m001kp/m001kp.module';
import { M002kpModule } from './m002kp/m002kp.module';
import { J736kpModule } from './j736kp/j736kp.module';
import { T002kpModule } from './t002kp/t002kp.module';

@Module({
    imports: [
        J736kpModule,
        k089kpModule,
        M001kpModule,
        M002kpModule,
        M008kpModule,
        Q141kpModule,
        Q90010p2Module,
        R027mp1Module,
        S001kpModule,
        S026kpModule,
        S030kpModule,
        T002kpModule,
        T016kpModule,
    ],
})
export class rtnlibfModule {}
