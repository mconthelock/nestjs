import { Module } from '@nestjs/common';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { RepModule } from 'src/webform/rep/rep.module';
import { UsersModule } from 'src/amec/users/users.module';
import { PappflowModule } from 'src/amec/pappflow/pappflow.module';
import { PurEvaController } from './pur-eva.controller';
import { PurEvaService } from './pur-eva.service';
import { PurevaFormModule } from './pureva_form/pureva_form.module';
import { PurevaProfitTurnoverModule } from './pureva_profit_turnover/pureva_profit_turnover.module';
import { PurevaScoreModule } from './pureva_score/pureva_score.module';
import { PurevaVendorRelationModule } from './pureva_vendor_relation/pureva_vendor_relation.module';
import { PurnvfAddressService } from '../pur-nvf/purnvf_address/purnvf_address.service';
import { PurnvfAddressRepository } from '../pur-nvf/purnvf_address/purnvf_address.repository';
import { PurEvaRequestService } from './pur-eva-request.service';
import { PurFileModule } from '../pur-file/pur-file.module';

@Module({
  controllers: [PurEvaController ],
  providers: [PurEvaService  , PurEvaRequestService , PurnvfAddressService , PurnvfAddressRepository],
  imports: [ PurFileModule , PurevaFormModule , PurevaProfitTurnoverModule , PurevaScoreModule , PurevaVendorRelationModule, FormModule , FlowModule , FormmstModule, RepModule, UsersModule,PappflowModule],
})
export class PurEvaModule {}
