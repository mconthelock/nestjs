import { Module } from '@nestjs/common';
import { FeFileModule } from './fe-file/fe-file.module';
import { FEOTModule } from './FE-OT/fe-ot.module';

@Module({
    imports: [FeFileModule, FEOTModule],
})
export class FeformModule {}
