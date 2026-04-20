import { Module } from '@nestjs/common';
import { StaticTestModule } from './static-test/static-test.module';
import { LoadLessTestModule } from './load-less-test/load-less-test.module';

@Module({
  imports: [
    StaticTestModule,
    LoadLessTestModule
  ]
})
export class MachineModule {}