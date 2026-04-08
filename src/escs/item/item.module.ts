import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemRepository } from './item.repository';
import { ITEM } from 'src/common/Entities/escs/table/ITEM.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ITEM], 'escsConnection')],
    controllers: [ItemController],
    providers: [ItemService, ItemRepository],
    exports: [ItemService],
})
export class ItemModule {}
