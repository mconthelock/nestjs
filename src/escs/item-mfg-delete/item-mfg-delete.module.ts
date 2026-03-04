import { Module } from '@nestjs/common';
import { ItemMfgDeleteService } from './item-mfg-delete.service';
import { ItemMfgDeleteController } from './item-mfg-delete.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITEM_MFG_DELETE } from 'src/common/Entities/escs/table/ITEM_MFG_DELETE.entity';
import { ItemMfgDeleteRepository } from './item-mfg-delete.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ITEM_MFG_DELETE], 'escsConnection')],
  controllers: [ItemMfgDeleteController],
  providers: [ItemMfgDeleteService, ItemMfgDeleteRepository],
  exports: [ItemMfgDeleteService],
})
export class ItemMfgDeleteModule {}
