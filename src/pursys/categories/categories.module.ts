import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { Categories } from 'src/common/Entities/pursys/table/CATEGORIES.entity';
import { CategoryAttributes } from 'src/common/Entities/pursys/table/CATEGORY_ATTRIBUTES.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [Categories, CategoryAttributes],
            'purConnection',
        ),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
