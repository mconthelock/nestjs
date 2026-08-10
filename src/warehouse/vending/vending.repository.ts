import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
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
        return this.pur.query(`
            SELECT * FROM PRODUCTS p 
            JOIN CATEGORIES c2 ON p.CATEGORY_ID = c2.CATEGORY_ID 
            WHERE p.CATEGORY_ID IN (
                SELECT c.CATEGORY_ID FROM CATEGORIES c 
                WHERE c.PARENT_ID IN ('6','7')
            )
        `);
    }

    async addTools(dto: AddToolsVendingDto) {
        const items = dto.ITEMS?.length ? dto.ITEMS : [];

        return this.ds.transaction(async (manager) => {
            const results = [];
            for (const item of items) {
                const result = await manager
                    .createQueryBuilder()
                    .insert()
                    .into('SKIDCNTRL.VENDING_TOOLS', [
                        'PRODUCT_ID',
                        'CREATE_BY',
                    ])
                    .values({
                        PRODUCT_ID: item.SPRODID,
                        CREATE_BY: dto.EMPNO,
                    })
                    .execute();
                results.push(result);
            }
            return results;
        });
    }

    async getTools() {
        return this.ds
            .createQueryBuilder()
            .select()
            .from('SKIDCNTRL.VENDING_TOOLS', 'vt')
            .getRawMany();
    }
}
