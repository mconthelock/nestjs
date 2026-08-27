import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

import { Warehouses } from 'src/common/Entities/pursys/table/WAREHOUSES.entity';

@Injectable()
export class WarehousesService {
    constructor(
        @InjectRepository(Warehouses, 'purConnection')
        private readonly wh: Repository<Warehouses>,
    ) {}
    create(createWarehouseDto: CreateWarehouseDto) {
        return this.wh.save(createWarehouseDto);
    }

    findAll() {
        return this.wh.find();
    }

    findOne(id: number) {
        return this.wh.findOne({ where: { WHID: id } });
    }

    update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
        return this.wh.update({ WHID: id }, updateWarehouseDto);
    }

    remove(id: number) {
        return this.wh.update({ WHID: id }, { IS_ACTIVE: '0' });
    }
}
