import { Module } from '@nestjs/common';
import { PurFileModule } from './pur-file/pur-file.module';
import { PurNvfModule } from './pur-nvf/purnvf.module';
import { PurnvfFormModule } from './pur-nvf/purnvf_form/purnvf_form.module';
import { PurCpmModule } from './pur-cpm/pur-cpm.module';
import { PurevaFormModule } from './pur-eva/pureva_form/pureva_form.module';
import { PurEvaModule } from './pur-eva/pur-eva.module';


@Module({
    imports: [PurFileModule, PurNvfModule, PurnvfFormModule, PurCpmModule, PurevaFormModule, PurEvaModule],
})
export class PurFormModule {}
