import { Module } from '@nestjs/common';
import { ItemModule } from './item/item.module';
import { UserSectionModule } from './user_section/user_section.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ItemModule,
    UserSectionModule,
    UserModule,
  ],
})
export class ESCSModule {}