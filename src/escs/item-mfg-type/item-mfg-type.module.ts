import { Module } from '@nestjs/common';
import { ItemMfgTypeService } from './item-mfg-type.service';
import { ItemMfgTypeController } from './item-mfg-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITEM_MFG_TYPE } from 'src/common/Entities/escs/table/ITEM_MFG_TYPE.entity';
import { ItemMfgTypeRepository } from './item-mfg-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ITEM_MFG_TYPE], 'escsConnection')],
  controllers: [ItemMfgTypeController],
  providers: [ItemMfgTypeService, ItemMfgTypeRepository],
  exports: [ItemMfgTypeService],
})
export class ItemMfgTypeModule {}
