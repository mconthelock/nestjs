import { Module } from '@nestjs/common';
import { FormModule } from './form/form.module';
import { FlowModule } from './flow/flow.module';
import { ISFormModule } from './isform/isform.module';
import { FlowmstModule } from './flowmst/flowmst.module';
import { FormmstModule } from './formmst/formmst.module';
import { GpOtModule } from './gpform/gp-ot/gp-ot.module';

@Module({
  imports: [ISFormModule, FormModule, FlowModule, FlowmstModule, FormmstModule, GpOtModule],
})
export class WebformModule {}
