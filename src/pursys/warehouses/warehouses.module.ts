import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';

import { Warehouses } from 'src/common/Entities/pursys/table/WAREHOUSES.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Warehouses], 'purConnection')],
    controllers: [WarehousesController],
    providers: [WarehousesService],
})
export class WarehousesModule {}
