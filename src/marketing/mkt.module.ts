import { Module } from '@nestjs/common';
import { OrdermainModule } from './ordermain/ordermain.module';
import { OrderpartsModule } from './orderparts/orderparts.module';
import { OrderdummyModule } from './orderdummy/orderdummy.module';
import { TmaintaintypeModule } from './tmaintaintype/tmaintaintype.module';
import { AgentModule } from './agent/agent.module';
import { AftsysdocModule } from './aftsysdoc/aftsysdoc.module';

@Module({
  imports: [
    OrdermainModule,
    OrderpartsModule,
    OrderdummyModule,
    TmaintaintypeModule,
    AgentModule,
    AftsysdocModule,
  ],
})
export class MktModule {}
