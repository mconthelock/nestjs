import { Module } from '@nestjs/common';
import { IetsListService } from './iets_list.service';
import { IetsListController } from './iets_list.controller';
import { IetsListRepository } from './iets_list.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IETS_LIST } from 'src/common/Entities/webform/table/IETS_LIST.entity';
import { IETS_FORM } from '../../../../common/Entities/webform/table/IETS_FORM.entity';
import { DWGNOTICEPICMST } from '../../../../common/Entities/webform/table/DWGNOTICEPICMST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        IETS_LIST,
        IETS_FORM,
        DWGNOTICEPICMST,
    ], 'mitsuConnection'),
    ],
    controllers: [IetsListController],
    providers: [IetsListService, IetsListRepository],
    exports: [IetsListService, IetsListRepository],
})
export class IetsListModule {}
