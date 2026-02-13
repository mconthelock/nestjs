import { Module } from '@nestjs/common';
import { ItemMfgService } from './item-mfg.service';
import { ItemMfgController } from './item-mfg.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { ItemMfgRepository } from './item-mfg.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ITEM_MFG], 'escsConnection')],
  controllers: [ItemMfgController],
  providers: [ItemMfgService, ItemMfgRepository],
  exports: [ItemMfgService],
})
export class ItemMfgModule {}
