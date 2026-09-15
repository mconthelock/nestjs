import { Module } from '@nestjs/common';
import { PurFileModule } from './pur-file/pur-file.module';
import { PurNvfModule } from './pur-nvf/purnvf.module';
import { PurnvfFormModule } from './pur-nvf/purnvf_form/purnvf_form.module';
import { PurCpmModule } from './pur-cpm/pur-cpm.module';
import { PurevaFormModule } from './pur-eva/pureva_form/pureva_form.module';
import { PurEvaModule } from './pur-eva/pur-eva.module';
import { PurVmmModule } from './pur-vmm/pur-vmm.module';
import { CondComparisonPriceModule } from './pur-cpc/cond_comparison_price/cond_comparison_price.module';

@Module({
    imports: [
        PurFileModule,
        PurNvfModule,
        PurnvfFormModule,
        PurCpmModule,
        PurevaFormModule,
        PurEvaModule,
        PurVmmModule,
        CondComparisonPriceModule,
    ],
})
export class PurFormModule {}
