import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { UsersSectionModule } from './user_section/user_section.module';
import { UsersModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { AuditReportMasterModule } from './audit_report_master/audit_report_master.module';
import { AuditReportRevisionModule } from './audit_report_revision/audit_report_revision.module';
import { AuditReportHistoryModule } from './audit_report_history/audit_report_history.module';
import { AuditReportMasterAllModule } from './audit_report_master_all/audit_report_master_all.module';
import { ItemStationModule } from './item-station/item-station.module';
import { UserItemModule } from './user-item/user-item.module';
import { UsersItemStationModule } from './user-item-station/user-item-station.module';
import { UsersFileModule } from './user-file/user-file.module';
import { UsersAuthorizeModule } from './user-authorize/user-authorize.module';
import { UsersAuthorizeViewModule } from './user-authorize-view/user-authorize-view.module';
import { BlockMasterModule } from './block-master/block-master.module';
import { ItemMfgModule } from './item-mfg/item-mfg.module';
import { ItemMfgTypeModule } from './item-mfg-type/item-mfg-type.module';
import { ItemSheetMfgModule } from './item-sheet-mfg/item-sheet-mfg.module';
import { ItemMfgListModule } from './item-mfg-list/item-mfg-list.module';
import { ItemMfgHistoryModule } from './item-mfg-history/item-mfg-history.module';
import { ItemMasterAuthorizeModule } from './item-master-authorize/item-master-authorize.module';
import { ItemMfgDeleteModule } from './item-mfg-delete/item-mfg-delete.module';
import { ControlDrawingPisModule } from './control-drawing-pis/control-drawing-pis.module';
import { MfgDrawingModule } from './mfg-drawing/mfg-drawing.module';
import { MfgSerialModule } from './mfg-serial/mfg-serial.module';
import { MfgDrawingActionModule } from './mfg-drawing-action/mfg-drawing-action.module';
import { ReturnApvListModule } from './return-apv-list/return-apv-list.module';
import { OrdersDrawingModule } from './orders-drawing/orders-drawing.module';
import { ChecksheetModule } from './checksheet/checksheet.module';

@Module({
    imports: [
        AuditReportHistoryModule,
        AuditReportMasterModule,
        AuditReportRevisionModule,
        AuditReportMasterAllModule,
        BlockMasterModule,
        ControlDrawingPisModule,
        ItemModule,
        ItemMasterAuthorizeModule,
        ItemMfgModule,
        ItemMfgDeleteModule,
        ItemMfgHistoryModule,
        ItemMfgListModule,
        ItemMfgTypeModule,
        ItemSheetMfgModule,
        ItemStationModule,
        OrdersModule,
        MfgDrawingModule,
        MfgDrawingActionModule,
        MfgSerialModule,
        UserItemModule,
        UsersAuthorizeModule,
        UsersAuthorizeViewModule,
        UsersItemStationModule,
        UsersFileModule,
        UsersModule,
        UsersSectionModule,
        ReturnApvListModule,
        OrdersDrawingModule,
        ChecksheetModule,
    ],
})
export class ESCSModule {}
