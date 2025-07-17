import { OrdermainModule } from './ordermain/ordermain.module';
import { OrderpartsModule } from './orderparts/orderparts.module';
import { OrderdummyModule } from './orderdummy/orderdummy.module';
import { AftsysdocModule } from './aftsysdoc/aftsysdoc.module';
import { TmaintaintypeModule } from './tmaintaintype/tmaintaintype.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    OrdermainModule,
    OrderpartsModule,
    OrderdummyModule,
    AftsysdocModule,
    TmaintaintypeModule,
    AgentModule,
  ],
})
export class MktModule {}
