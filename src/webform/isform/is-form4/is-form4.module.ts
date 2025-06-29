import { Module } from '@nestjs/common';
import { IsForm4Service } from './is-form4.service';
import { IsForm4Controller } from './is-form4.controller';

@Module({
  controllers: [IsForm4Controller],
  providers: [IsForm4Service],
})
export class IsForm4Module {}
