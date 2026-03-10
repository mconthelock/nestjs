import { Request } from 'express';
import {
    DataSource,
    EntityManager,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';
import { FiltersDto } from '../dto/filter.dto';

export class BaseRepository {
    constructor(
        private dataSource: DataSource,
        private request: Request,
    ) {}

    protected get manager(): EntityManager {
        // return this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
        const txManager = this.request[ENTITY_MANAGER_KEY];

        if (txManager && txManager.connection === this.dataSource) {
            return txManager;
        }

        return this.dataSource.manager;
    }

    protected getRepository<T>(entityCls: new () => T): Repository<T> {
        return this.manager.getRepository(entityCls);
    }

    protected applyFilters<T>(
        qb: SelectQueryBuilder<T>,
        alias: string,
        condition: FiltersDto,
        allowedFields: string[],
    ) {
        const operatorMap = {
            eq: '=',
            ne: '!=',
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
        };

        condition.filters.forEach((f, i) => {
            if (!allowedFields.includes(f.field)) return;

            const param = `val_${i}`;

            const column = f.field.includes('.')
                ? f.field
                : `${alias}.${f.field}`;

            switch (f.op) {
                case 'like':
                    qb.andWhere(`${column} LIKE :${param}`, {
                        [param]: `%${f.value}%`,
                    });
                    break;

                case 'startsWith':
                    qb.andWhere(`${column} LIKE :${param}`, {
                        [param]: `${f.value}%`,
                    });
                    break;

                case 'endsWith':
                    qb.andWhere(`${column} LIKE :${param}`, {
                        [param]: `%${f.value}`,
                    });
                    break;

                case 'in':
                    qb.andWhere(`${column} IN (:...${param})`, {
                        [param]: f.value,
                    });
                    break;

                case 'notIn':
                    qb.andWhere(`${column} NOT IN (:...${param})`, {
                        [param]: f.value,
                    });
                    break;

                case 'isNull':
                    qb.andWhere(`${column} IS NULL`);
                    break;

                case 'isNotNull':
                    qb.andWhere(`${column} IS NOT NULL`);
                    break;

                default:
                    if (operatorMap[f.op]) {
                        qb.andWhere(
                            `${column} ${operatorMap[f.op]} :${param}`,
                            {
                                [param]: f.value,
                            },
                        );
                    }
            }
        });

        return qb;
    }
}
