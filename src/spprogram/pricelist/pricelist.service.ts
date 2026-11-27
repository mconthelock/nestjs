import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Pricelist } from './entities/pricelist.entity';
import { ItemsCustomer } from '../items-customer/entities/items-customer.entity';

import { updatePriceListDto } from './dto/update-price.dto';

@Injectable()
export class PricelistService {
    constructor(
        @InjectRepository(Pricelist, 'mitsuConnection')
        private readonly price: Repository<Pricelist>,

        @InjectRepository(ItemsCustomer, 'mitsuConnection')
        private readonly itemscus: Repository<ItemsCustomer>,

        @InjectDataSource('mitsuConnection')
        private readonly dataSource: DataSource,
    ) {}

    async findAll(data: updatePriceListDto) {
        const where: Record<string, any> = {};
        for (const [key, value] of Object.entries(data ?? {})) {
            if (value !== undefined) {
                where[key] = value;
            }
        }
        return this.price.find({
            relations: ['itemdesc'],
            where,
            order: { STARTIN: 'DESC', PRICE_ID: 'DESC' },
        });
    }

    async findCustomer(data: any) {
        return this.itemscus.find({
            relations: ['itemdesc', 'itemdesc.prices', 'customer', 'customer.rate'],
            where: {
                ...data,
                itemdesc: {
                    ITEM_STATUS: 1,
                    prices: {
                        LATEST: 1,
                    },
                },
            },
        });
    }

    async updatePrice(data: updatePriceListDto) {
        return this.dataSource.transaction(async (manager) => {
            const currentLatest = await manager.findOne(Pricelist, {
                where: {
                    FYYEAR: data.FYYEAR,
                    PERIOD: data.PERIOD,
                    ITEM: data.ITEM,
                    LATEST: 1,
                },
                order: { PRICE_ID: 'DESC' },
            });

            if (
                currentLatest &&
                Number(currentLatest.FCCOST) === Number(data.FCCOST) &&
                Number(currentLatest.FCBASE) === Number(data.FCBASE) &&
                Number(currentLatest.TCCOST) === Number(data.TCCOST)
            ) {
                return currentLatest;
            }

            if (currentLatest) {
                await manager
                    .createQueryBuilder()
                    .update(Pricelist)
                    .set({
                        LATEST: 0,
                        ENDIN: () => 'SYSDATE',
                    })
                    .where('ITEM = :item', { item: data.ITEM })
                    .andWhere('FYYEAR = :fyyear', { fyyear: data.FYYEAR })
                    .andWhere('PERIOD = :period', { period: data.PERIOD })
                    .andWhere('LATEST = :latest', { latest: 1 })
                    .execute();
            }

            const { PRICE_ID: _ignoredPriceId, ENDIN: _ignoredEndin, ...payload } = data;
            const newPrice = manager.create(Pricelist, {
                ...payload,
                STATUS: 1,
                LATEST: 1,
                STARTIN: data.STARTIN ?? new Date(),
                ENDIN: null,
                CREATE_AT: data.CREATE_AT ?? new Date(),
            });

            return manager.save(Pricelist, newPrice);
        });
    }
}
