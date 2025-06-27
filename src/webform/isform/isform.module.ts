import { Module } from '@nestjs/common';
import { IsDevModule } from './is-dev/is-dev.module';
import { IsForm3Module } from './is-form3/is-form3.module';
import { IsMoModule } from './is-mo/is-mo.module';

@Module({
  imports: [IsDevModule, IsForm3Module, IsMoModule],
})
export class ISFormModule {}
