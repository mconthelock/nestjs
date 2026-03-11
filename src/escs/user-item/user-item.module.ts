import { Module } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { UserItemController } from './user-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USERS_ITEM } from 'src/common/Entities/escs/table/USERS_ITEM.entity';

@Module({
  imports: [TypeOrmModule.forFeature([USERS_ITEM], 'escsConnection')],
  controllers: [UserItemController],
  providers: [UserItemService],
  exports: [UserItemService],
})
export class UserItemModule {}
