import { Module } from '@nestjs/common';
import { PurVendorsCodeModule } from './pur_vendors_code/pur_vendors_code.module';
import { PurVendorsModule } from './pur_vendors/pur_vendors.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CurrencyModule } from './currency/currency.module';
import { TermcodeModule } from './termcode/termcode.module';
import { VendorsModule } from './vendors/vendors.module';
import { StocksModule } from './stocks/stocks.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
    imports: [
        PurVendorsModule,
        PurVendorsCodeModule,
        ProductsModule,
        CategoriesModule,
        CurrencyModule,
        TermcodeModule,
        VendorsModule,
        StocksModule,
        WarehousesModule,
    ],
})
export class PursysModule {}
