import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';

import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';
import { GPLY01_TAXAS400 } from 'src/common/Entities/webform/table/GPLY01_TAXAS400.entity';
import { EMP03T } from 'src/common/Entities/webform/views/EMP03T.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
import { TaxRepository } from './tax.repository';
import { FormModule } from 'src/webform/form/form.module';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GPLY01_TAX, GPLY01_TAXAS400, EMP03T, FORM, FLOW],
            'mitsuConnection',
        ),
        FormModule,
    ],
    controllers: [TaxController],
    providers: [TaxService, TaxRepository],
    exports: [TaxService],
})
export class TaxModule {}
