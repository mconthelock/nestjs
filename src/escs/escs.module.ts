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
  ],
})
export class ESCSModule {}