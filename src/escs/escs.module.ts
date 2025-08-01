import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { UserSectionModule } from './user_section/user_section.module';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ItemModule,
    UserSectionModule,
    UserModule,
    OrdersModule,
  ],
})
export class ESCSModule {}