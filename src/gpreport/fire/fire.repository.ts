import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Brackets, DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FireItemMst } from 'src/common/Entities/gpreport/table/FIRE_ITEM_MST.entity';
import { SearchFireItemDto } from './dto/search-fire-item.dto';

@Injectable()
export class FireRepository extends BaseRepository {
    constructor(@InjectDataSource('mitsuConnection') dataSource: DataSource) {
        super(dataSource);
    }

    findOne(fireCode: string) {
        return this.getRepository(FireItemMst).findOne({ where: { FIRE_CODE: fireCode } });
    }

    async search(query: SearchFireItemDto) {
        const { page = 1, limit = 20 } = query;
        const qb = this.getRepository(FireItemMst).createQueryBuilder('F');
        const fields = ['FIRE_CODE', 'LOCATION', 'FTYPE', 'CAPACITY', 'AREA'] as const;
        // Escape LIKE metacharacters so user input is treated as literal text.
        const pattern = (value: string) => '%' + value.replace(/[!%_]/g, '!$&').toUpperCase() + '%';
        if (query.search?.trim()) {
            qb.andWhere(new Brackets(sub => {
                fields.forEach((field, index) => {
                    const sql = `UPPER(F.${field}) LIKE :search ESCAPE '!'`;
                    if (index === 0) sub.where(sql, { search: pattern(query.search.trim()) });
                    else sub.orWhere(sql);
                });
            }));
        }
        for (const field of fields) {
            if (query[field]?.trim()) {
                qb.andWhere(`UPPER(F.${field}) LIKE :${field} ESCAPE '!'`, {
                    [field]: pattern(query[field].trim()),
                });
            }
        }
        if (query.STATUS !== undefined) {
            qb.andWhere('F.STATUS = :status', { status: query.STATUS });
        }
        const [data, total] = await qb.orderBy('F.FIRE_CODE', 'ASC')
            .skip((page - 1) * limit).take(limit).getManyAndCount();
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async create(data: Partial<FireItemMst>) {
        // insert prevents accidentally overwriting an existing primary key.
        await this.getRepository(FireItemMst).insert(data);
        return this.findOne(data.FIRE_CODE);
    }

    update(fireCode: string, data: Partial<FireItemMst>) {
        return this.getRepository(FireItemMst).update({ FIRE_CODE: fireCode }, data);
    }

    delete(fireCode: string) {
        return this.getRepository(FireItemMst).delete({ FIRE_CODE: fireCode });
    }
}

