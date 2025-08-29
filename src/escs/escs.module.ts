import { Module } from '@nestjs/common';
import { ESCSItemModule } from './item/item.module';
import { ESCSUserSectionModule } from './user_section/user_section.module';
import { ESCSUserModule } from './user/user.module';
import { ESCSOrdersModule } from './orders/orders.module';
import { ESCSARMModule } from './audit_report_master/audit_report_master.module';
import { ESCSARRModule } from './audit_report_revision/audit_report_revision.module';

@Module({
  imports: [
    ESCSItemModule,
    ESCSUserSectionModule,
    ESCSUserModule,
    ESCSOrdersModule,
    ESCSARMModule,
    ESCSARRModule,
  ],
})
export class ESCSModule {}