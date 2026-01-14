import { Module } from '@nestjs/common';
import { IeBgrService } from './ie-bgr.service';
import { IeBgrController } from './ie-bgr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { EbgreqformModule } from 'src/ebudget/ebgreqform/ebgreqform.module';
import { EbgreqattfileModule } from 'src/ebudget/ebgreqattfile/ebgreqattfile.module';
import { EbgreqcolImageModule } from 'src/ebudget/ebgreqcol-image/ebgreqcol-image.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { EbudgetQuotationModule } from 'src/ebudget/ebudget-quotation/ebudget-quotation.module';
import { EbudgetQuotationProductModule } from 'src/ebudget/ebudget-quotation-product/ebudget-quotation-product.module';
import { PprbiddingModule } from 'src/amec/pprbidding/pprbidding.module';

@Module({
  imports: [
    FormModule,
    FormmstModule,
    EbgreqformModule,
    EbgreqattfileModule,
    EbgreqcolImageModule,
    EbudgetQuotationModule,
    EbudgetQuotationProductModule,
    FlowModule,
    PprbiddingModule
  ],
  controllers: [IeBgrController],
  providers: [IeBgrService],
})
export class IeBgrFormModule {}
