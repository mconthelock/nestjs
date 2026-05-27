import { Module } from '@nestjs/common';
import { PurCpmModule } from './pur-cpm/pur-cpm.module';
import { PurFileModule } from './pur-file/pur-file.module';
import { PurNvfModule } from './pur-nvf/purnvf.module';

@Module({
    imports: [PurCpmModule, PurFileModule, PurNvfModule],
})
export class PurFormModule {}
