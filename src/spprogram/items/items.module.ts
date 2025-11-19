import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Items } from './entities/items.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Items], 'spsysConnection')],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
