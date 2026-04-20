import { Module } from '@nestjs/common';
import { StaticTestModule } from './static-test/static-test.module';

@Module({
  imports: [
    StaticTestModule,
  ]
})
export class MachineModule {}