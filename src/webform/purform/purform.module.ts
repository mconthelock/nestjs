import { Module } from '@nestjs/common';
import { PurCpmModule } from './pur-cpm/pur-cpm.module';
import { PurFileModule } from './pur-file/pur-file.module';

@Module({
    imports: [PurCpmModule, PurFileModule],
})
export class PurFormModule {}
