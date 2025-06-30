import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { Form } from './entities/form.entity';
import { Flow } from './../flow/entities/flow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Flow], 'amecConnection')],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
