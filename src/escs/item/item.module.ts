import { Module } from '@nestjs/common';
import { ESCSItemService } from './item.service';
import { ESCSItemController } from './item.controller';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Item], 'amecConnection')],
  controllers: [ESCSItemController],
  providers: [ESCSItemService],
})
export class ESCSItemModule {}
