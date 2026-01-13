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

@Module({
  imports: [FormModule, FormmstModule, EbgreqformModule, EbgreqattfileModule, EbgreqcolImageModule, FlowModule],
  controllers: [IeBgrController],
  providers: [IeBgrService],
})
export class IeBgrModule {}
