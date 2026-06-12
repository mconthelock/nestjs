import { Module } from '@nestjs/common';
import { PurFileModule } from './pur-file/pur-file.module';
import { PurNvfModule } from './pur-nvf/purnvf.module';
import { PurnvfFormModule } from './pur-nvf/purnvf_form/purnvf_form.module';
import { PurnvfLocationModule } from './pur-nvf/purnvf_location/purnvf_location.module';

@Module({
    imports: [ PurFileModule, PurNvfModule, PurnvfFormModule , PurnvfFormModule ],
})
export class PurFormModule {}
