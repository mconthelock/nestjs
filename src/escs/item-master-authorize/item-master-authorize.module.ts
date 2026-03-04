import { Module } from '@nestjs/common';
import { ItemMasterAuthorizeService } from './item-master-authorize.service';
import { ItemMasterAuthorizeController } from './item-master-authorize.controller';
import { ITEM_MASTER_AUTHORIZE } from 'src/common/Entities/escs/table/ITEM_MASTER_AUTHORIZE.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMasterAuthorizeRepository } from './item-master-authorize.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ITEM_MASTER_AUTHORIZE], 'escsConnection'),
  ],
  controllers: [ItemMasterAuthorizeController],
  providers: [ItemMasterAuthorizeService, ItemMasterAuthorizeRepository],
  exports: [ItemMasterAuthorizeService],
})
export class ItemMasterAuthorizeModule {}
