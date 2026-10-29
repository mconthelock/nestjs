import { Module } from '@nestjs/common';
import { ConectionModule } from './conection/conection.module';

import { BpcsfvnewModule } from './bpcsfvnew/bpcsfvnew.module';
import { rtnlibfModule } from './rtnlibf/rtnlibf.module';
import { DataliboModule } from './datalibo/datalibo.module';
import { ShopfModule } from './shopf/shopf.module';

@Module({
    imports: [
        ConectionModule,
        BpcsfvnewModule,
        rtnlibfModule,
        DataliboModule,
        ShopfModule,
    ],
})
export class AS400Module {}
