import { Module } from '@nestjs/common';
import { ESCSItemModule } from './item/item.module';
import { ESCSUserSectionModule } from './user_section/user_section.module';
import { ESCSUserModule } from './user/user.module';
import { ESCSOrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ESCSItemModule,
    ESCSUserSectionModule,
    ESCSUserModule,
    ESCSOrdersModule,
  ],
})
export class ESCSModule {}