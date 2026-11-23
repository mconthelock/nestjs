import { Module } from '@nestjs/common';
import { ConectionModule } from './conection/conection.module';

import { BpcsfvnewModule } from './bpcsfvnew/bpcsfvnew.module';
import { DatalibiModule } from './datalibi/datalibi.module';
import { DataliboModule } from './datalibo/datalibo.module';
import { RtnlibfModule } from './rtnlibf/rtnlibf.module';
import { ShopfModule } from './shopf/shopf.module';

@Module({
    imports: [
        ConectionModule,
        BpcsfvnewModule,
        DatalibiModule,
        DataliboModule,
        RtnlibfModule,
        ShopfModule,
    ],
})
export class AS400Module {}
