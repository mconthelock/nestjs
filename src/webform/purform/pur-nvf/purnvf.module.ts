import { Module } from '@nestjs/common';
import { PurnvfFormModule } from './purnvf_form/purnvf_form.module';
import { PurnvfListModule } from './purnvf_list/purnvf_list.module';
import { PurnvfAddressModule } from './purnvf_address/purnvf_address.module';

@Module({
    imports: [PurnvfFormModule, PurnvfListModule, PurnvfAddressModule],
})
export class PurNvfModule {}
