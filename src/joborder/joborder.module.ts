import { Module } from '@nestjs/common';
import { OrderListModule } from './orderlist/orderlist.module';
import { SetRequestDateModule } from './set-request-date/set-request-date.module';
import { JopMarReqModule } from './jop-mar-req/jop-mar-req.module';
import { JopPurConfModule } from './jop-pur-conf/jop-pur-conf.module';

@Module({
  imports: [
    OrderListModule,
    SetRequestDateModule,
    JopMarReqModule,
    JopPurConfModule,
  ],
})
export class JobOrderModule {}