import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { Items } from './entities/items.entity';
import { ItemsController } from './items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Items], 'spsysConnection')],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
