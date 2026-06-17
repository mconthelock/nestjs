import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PRODUCTS } from 'src/common/Entities/pursys/table/PRODUCTS.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PRODUCTS], 'purConnection')],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule {}
