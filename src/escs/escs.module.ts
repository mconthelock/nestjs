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
  ],
})
export class ESCSModule {}