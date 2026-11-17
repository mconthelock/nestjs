import { Module } from '@nestjs/common';
import { IetsFormService } from './iets_form.service';
import { IetsFormController } from './iets_form.controller';
import { IetsFormRepository } from './iets_form.repository';
import { IetsListModule } from '../iets_list/iets_list.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IETS_FORM } from 'src/common/Entities/webform/table/IETS_FORM.entity';
import { DWGNOTICEPICMST } from 'src/common/Entities/webform/table/DWGNOTICEPICMST.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { VORGMST } from '../../../../common/Entities/webform/views/VORGMST.entity';
import { IETS_LIST } from '../../../../common/Entities/webform/table/IETS_LIST.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { User } from 'src/common/Entities/amec/views/user.entity';
import { ORGPOS } from '../../../../common/Entities/webform/table/ORGPOS.entity';
import { QAINS_FORM } from '../../../../common/Entities/webform/table/QAINS_FORM.entity';
import { QAINS_OPERATOR_AUDITOR } from '../../../../common/Entities/webform/table/QAINS_OPERATOR_AUDITOR.entity';
import { USERS } from '../../../../common/Entities/escs/table/USERS.entity';
import { INV_YEARLY_ASSIGN } from '../../../../common/Entities/skid/table/INV_YEARLY_ASSIGN.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        IETS_FORM,
        DWGNOTICEPICMST,
        AMECUSERALL,
        VORGMST,
        IETS_LIST,
        FORM,
        User,
        ORGPOS,
        QAINS_FORM,
        QAINS_OPERATOR_AUDITOR,
        USERS,
        INV_YEARLY_ASSIGN,
    ], 'mitsuConnection'),IetsListModule],
    controllers: [IetsFormController],
    providers: [IetsFormService, IetsFormRepository],
    exports: [IetsFormRepository],
})
export class IetsFormModule {}
