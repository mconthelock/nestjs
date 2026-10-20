import { Module } from '@nestjs/common';
import { CmSmModule } from './cm-sm/cm-sm.module';

@Module({
    imports: [
        CmSmModule
    ],
})
export class DtiModule {}
