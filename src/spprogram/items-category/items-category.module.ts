import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsCategoryService } from './items-category.service';
import { ItemsCategoryController } from './items-category.controller';
import { Category } from '../items-category/entities/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Category], 'spsysConnection')],
  controllers: [ItemsCategoryController],
  providers: [ItemsCategoryService],
})
export class ItemsCategoryModule {}
