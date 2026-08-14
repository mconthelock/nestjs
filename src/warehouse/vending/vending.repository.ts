import { Injectable } from '@nestjs/common';
import { DataSource, Repository, In, IsNull, Or, Equal } from 'typeorm';
import { AddToolsVendingDto } from './dto/addtools-vending.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/common/Entities/pursys/table/PRODUCTS.entity';

@Injectable()
export class VendingRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
        @InjectDataSource('purConnection') private pur: DataSource,
    ) {
        super(ds);
    }

    async getProduct() {
        return this.pur.getRepository(Products).find({
            relations: {
                category: true,
            },
            where: {
                category: {
                    PARENT_ID: In([6, 7]),
                },
                IS_VENDING: Or(IsNull(), Equal(0)),
            },
        });
    }

    async addTools(dto: AddToolsVendingDto) {
        const items = dto.ITEMS?.length ? dto.ITEMS : [];

        return this.ds.transaction(async (manager) => {
            const results = [];

            for (const item of items) {
                const result = await manager.update(
                    Products,
                    { ID: item.ID },
                    { IS_VENDING: '1' },
                );

                results.push(result);
            }

            return results;
        });
    }

    async getTools() {
        return this.getRepository(Products).find({
            where: {
                IS_VENDING: '1',
            },
            relations: {
                category: true,
            },
        });
    }
}
