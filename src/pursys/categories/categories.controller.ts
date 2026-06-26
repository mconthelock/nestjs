import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateAttributeDto } from './dto/create-category-attribute.dto';

@Controller('pursys/categories')
export class CategoriesController {
    constructor(private readonly cate: CategoriesService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.cate.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.cate.findTree();
    }

    // POST /categories/10/attributes
    @Post(':categoryId/attributes')
    addAttribute(
        @Param('categoryId', ParseIntPipe) categoryId: number,
        @Body() createAttributeDto: CreateAttributeDto,
    ) {
        return this.cate.addAttribute(categoryId, createAttributeDto);
    }

    // GET /categories/10/attributes
    @Get(':categoryId/attributes')
    getAttributes(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.cate.getAttributesByCategory(categoryId);
    }

    // DELETE /categories/attributes/5  (ไม่ได้อิงตาม categoryId แล้ว เพราะ id ของ attribute มัน unique อยู่แล้ว)
    @Delete('attributes/:attributeId')
    removeAttribute(@Param('attributeId', ParseIntPipe) attributeId: number) {
        return this.cate.removeAttribute(attributeId);
    }
}
