import { Module } from '@nestjs/common';
import { WireHarnessModule } from './wire-harness/wire-harness.module';

@Module({
    imports: [
        WireHarnessModule,
    ],
})
export class InnovatModule {}
