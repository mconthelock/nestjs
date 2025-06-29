import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsForm1Service } from './is-form1.service';
import { IsForm1Controller } from './is-form1.controller';

import { IsForm1 } from './entities/is-form1.entity';
import { Workplan } from '../../../docinv/workplan/entities/workplan.entity';
@Module({
  imports: [TypeOrmModule.forFeature([IsForm1, Workplan], 'amecConnection')],
  controllers: [IsForm1Controller],
  providers: [IsForm1Service],
})
export class IsForm1Module {}
