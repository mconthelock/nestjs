import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Form } from './entities/form.entity';
import { Flow } from './../flow/entities/flow.entity';
import { FormmstModule } from '../formmst/formmst.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, Flow], 'amecConnection'),
    FormmstModule,
    CommonModule
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
