import { Module } from '@nestjs/common';
import { FinPckService } from './fin-pck.service';
import { FinPckController } from './fin-pck.controller';
import { FinpckAssetModule } from './finpck_asset/finpck_asset.module';
import { FinpckFormModule } from './finpck_form/finpck_form.module';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { RepModule } from 'src/webform/rep/rep.module';
import { UsersModule } from 'src/amec/users/users.module';
import { PappflowModule } from 'src/amec/pappflow/pappflow.module';
import { OrgTreeModule } from 'src/webform/org-tree/org-tree.module';


@Module({
  controllers: [FinPckController],
  providers: [FinPckService],
  imports: [FinpckAssetModule, FinpckFormModule , FormModule , FlowModule , FormmstModule, RepModule, UsersModule,PappflowModule,OrgTreeModule],
})
export class FinPckModule {}
