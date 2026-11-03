import { Module } from '@nestjs/common';
import { ItemMfgHistoryService } from './item-mfg-history.service';
import { ItemMfgHistoryController } from './item-mfg-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMfgHistoryRepository } from './item-mfg-history.repository';
import { ITEM_MFG_HISTORY } from 'src/common/Entities/escs/table/ITEM_MFG_HISTORY.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ITEM_MFG_HISTORY], 'mitsuConnection')],
    controllers: [ItemMfgHistoryController],
    providers: [ItemMfgHistoryService, ItemMfgHistoryRepository],
    exports: [ItemMfgHistoryService],
})
export class ItemMfgHistoryModule {}
