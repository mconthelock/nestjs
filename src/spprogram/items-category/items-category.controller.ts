import { Controller, Get } from '@nestjs/common';
import { ItemsCategoryService } from './items-category.service';

@Controller('sp/items/category')
export class ItemsCategoryController {
  constructor(private readonly cate: ItemsCategoryService) {}

  @Get('all')
  findAllCategories() {
    return this.cate.findAll();
  }
}
