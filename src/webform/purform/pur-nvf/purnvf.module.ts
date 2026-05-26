import { Module } from '@nestjs/common';
import { PurnvfFormModule } from './purnvf_form/purnvf_form.module';
import { PurnvfListModule } from './purnvf_list/purnvf_list.module';

@Module({
    imports: [PurnvfFormModule, PurnvfListModule],
})
export class PurNvfModule {}
