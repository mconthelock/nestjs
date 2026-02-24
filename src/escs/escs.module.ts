import { Module } from '@nestjs/common';
import { ESCSItemModule } from './item/item.module';
import { ESCSUserSectionModule } from './user_section/user_section.module';
import { ESCSUserModule } from './user/user.module';
import { ESCSOrdersModule } from './orders/orders.module';
import { ESCSARMModule } from './audit_report_master/audit_report_master.module';
import { ESCSARRModule } from './audit_report_revision/audit_report_revision.module';
import { ESCSARHModule } from './audit_report_history/audit_report_history.module';
import { ESCSARMAModule } from './audit_report_master_all/audit_report_master_all.module';
import { ESCSItemStationModule } from './item-station/item-station.module';
import { ESCSUserItemModule } from './user-item/user-item.module';
import { ESCSUserItemStationModule } from './user-item-station/user-item-station.module';
import { ESCSUserFileModule } from './user-file/user-file.module';
import { ESCSUserAuthorizeModule } from './user-authorize/user-authorize.module';
import { ESCSUserAuthorizeViewModule } from './user-authorize-view/user-authorize-view.module';
import { BlockMasterModule } from './block-master/block-master.module';
import { ItemMfgModule } from './item-mfg/item-mfg.module';
import { ItemMfgTypeModule } from './item-mfg-type/item-mfg-type.module';
import { ItemSheetMfgModule } from './item-sheet-mfg/item-sheet-mfg.module';
import { ItemMfgListModule } from './item-mfg-list/item-mfg-list.module';
import { ItemMfgHistoryModule } from './item-mfg-history/item-mfg-history.module';
import { ItemMasterAuthorizeModule } from './item-master-authorize/item-master-authorize.module';
import { ItemMfgDeleteModule } from './item-mfg-delete/item-mfg-delete.module';
import { ControlDrawingPisModule } from './control-drawing-pis/control-drawing-pis.module';

@Module({
  imports: [
    ESCSItemModule,
    ESCSUserSectionModule,
    ESCSUserModule,
    ESCSOrdersModule,
    ESCSARMModule,
    ESCSARRModule,
    ESCSARHModule,
    ESCSARMAModule,
    ESCSItemStationModule,
    ESCSUserItemModule,
    ESCSUserItemStationModule,
    ESCSUserFileModule,
    ESCSUserAuthorizeModule,
    ESCSUserAuthorizeViewModule,
    BlockMasterModule,
    ItemMfgModule,
    ItemMfgTypeModule,
    ItemSheetMfgModule,
    ItemMfgListModule,
    ItemMfgHistoryModule,
    ItemMasterAuthorizeModule,
    ItemMfgDeleteModule,
    ControlDrawingPisModule,
  ],
})
export class ESCSModule {}