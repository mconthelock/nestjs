import { Module } from '@nestjs/common';
import { IsForm3Service } from './is-form3.service';
import { IsForm3Controller } from './is-form3.controller';

@Module({
  controllers: [IsForm3Controller],
  providers: [IsForm3Service],
})
export class IsForm3Module {}
