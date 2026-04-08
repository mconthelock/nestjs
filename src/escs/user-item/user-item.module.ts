import { Module } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { UserItemController } from './user-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USERS_ITEM } from 'src/common/Entities/escs/table/USERS_ITEM.entity';
import { UserItemRepository } from './user-item.repository';

@Module({
    imports: [TypeOrmModule.forFeature([USERS_ITEM], 'escsConnection')],
    controllers: [UserItemController],
    providers: [UserItemService, UserItemRepository],
    exports: [UserItemService],
})
export class UserItemModule {}
