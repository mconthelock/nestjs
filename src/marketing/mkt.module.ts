import { Module } from '@nestjs/common';
import { OrdermainModule } from './ordermain/ordermain.module';
import { OrderpartsModule } from './orderparts/orderparts.module';
import { OrderdummyModule } from './orderdummy/orderdummy.module';
import { AgentModule } from './agent/agent.module';
import { AftsysdocModule } from './aftsysdoc/aftsysdoc.module';
import { MscountryModule } from './mscountry/mscountry.module';
import { TmaintaintypeModule } from './tmaintaintype/tmaintaintype.module';
import { SpcalsheetModule } from './spcalsheet/spcalsheet.module';

@Module({
  imports: [
    OrdermainModule,
    OrderpartsModule,
    OrderdummyModule,
    TmaintaintypeModule,
    AgentModule,
    AftsysdocModule,
    MscountryModule,
    SpcalsheetModule,
  ],
})
export class MktModule {}
