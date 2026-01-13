import { Module } from '@nestjs/common';
import { IeBgrService } from './ie-bgr.service';
import { IeBgrController } from './ie-bgr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';

@Module({
  imports: [FormModule, FormmstModule],
  controllers: [IeBgrController],
  providers: [IeBgrService],
})
export class IeBgrModule {}
