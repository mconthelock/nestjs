import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinventoryService } from './checkinventory.service';
import { CheckinventoryController } from './checkinventory.controller';
import { CheckinventoryRepository } from './checkinventory.repository';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { INV_HALFYEAR_REPORT } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT.entity';
import { INV_HALFYEAR_REPORT_ASSIGN } from 'src/common/Entities/skid/table/INV_HALFYEAR_REPORT_ASSIGN.entity';
import { PSCI_FORM } from 'src/common/Entities/webform/table/PSCI_FORM.entity';
import { PSCIH_FORM } from 'src/common/Entities/webform/table/PSCIH_FORM.entity';
import { INV_HALFYEAR_RESULT } from 'src/common/Entities/skid/table/INV_HALFYEAR_RESULT.entity';
import { INV_YEARLY_RESULT } from 'src/common/Entities/skid/table/INV_YEARLY_RESULT.entity';
import { INV_YEARLY_ASSIGN } from 'src/common/Entities/skid/table/INV_YEARLY_ASSIGN.entity';
import { PSYIC_FORM } from 'src/common/Entities/webform/table/PSYIC_FORM.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                INV_HALFYEAR_REPORT,
                INV_HALFYEAR_REPORT_ASSIGN,
                PSCI_FORM,
                PSCIH_FORM,
                INV_HALFYEAR_RESULT,
                INV_YEARLY_RESULT,
                INV_YEARLY_ASSIGN,
                PSYIC_FORM,
            ],
            'mitsuConnection',
        ),
        FormmstModule,
        FormModule,
        ConectionModule,
    ],
    controllers: [CheckinventoryController],
    providers: [CheckinventoryService, CheckinventoryRepository],
})
export class CheckinventoryModule {}
