import { Module } from '@nestjs/common';
import { IsDevModule } from './is-dev/is-dev.module';
import { IsForm3Module } from './is-form3/is-form3.module';
import { IsMoModule } from './is-mo/is-mo.module';
import { IsForm1Module } from './is-form1/is-form1.module';
import { IsForm4Module } from './is-form4/is-form4.module';

@Module({
  imports: [IsDevModule, IsForm3Module, IsMoModule, IsForm1Module, IsForm4Module],
})
export class ISFormModule {}
