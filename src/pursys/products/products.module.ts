import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { OptionRegistryService } from './option-registry.service';
import { ProductsController } from './products.controller';

import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Products], 'purConnection'),
        CategoriesModule,
    ],
    controllers: [ProductsController],
    providers: [ProductsService, OptionRegistryService],
})
export class ProductsModule {}
