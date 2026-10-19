import { Module } from '@nestjs/common';
import { ConectionModule } from './conection/conection.module';

import { BpcsfvnewModule } from './bpcsfvnew/bpcsfvnew.module';
import { rtnlibfModule } from './rtnlibf/rtnlibf.module';
import { DataliboModule } from './datalibo/datalibo.module';
import { ShopfModule } from './shopf/shopf.module';
// import { F001kpModule } from './shopf/f001kp/f001kp.module';

@Module({
    imports: [
        ConectionModule,
        BpcsfvnewModule,
        rtnlibfModule,
        // F001kpModule,
        // F002kpModule,
        // F003kpModule,
        // Q90010p2Module,
        // M008kpModule,
        // Q141kpModule,
        // T016kpModule,
        DataliboModule,
        ShopfModule,
    ],
})
export class AS400Module {}
