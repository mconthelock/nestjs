import { Module } from '@nestjs/common';
import { PsVarService } from './ps-var.service';
import { PsVarController } from './ps-var.controller';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';

@Module({
  imports: [FormModule, FormmstModule],
  controllers: [PsVarController],
  providers: [PsVarService],
})
export class PsVarModule {}
