import {
    Brackets,
    DataSource,
    EntityManager,
    Repository,
    SelectQueryBuilder,
    WhereExpressionBuilder,
} from 'typeorm';
import { transactionContext } from '../interceptors/transaction-context';
import { FiltersDto } from '../dto/filter.dto';

export class BaseRepository {
    constructor(private dataSource: DataSource) {}

    protected get manager(): EntityManager {
        const store = transactionContext.getStore();
        const txManager = store?.manager;
        const forceTx = store?.forceTx;
        // 🟢 โหมดบังคับใช้ connection เดียว
        if (forceTx && txManager && !txManager.queryRunner?.isReleased) {
            return txManager;
        }

        // 🔵 โหมดปกติ (ปลอดภัย multi-connection)
        if (
            txManager &&
            txManager.connection === this.dataSource &&
            !txManager.queryRunner?.isReleased
        ) {
            return txManager;
        }

        return this.dataSource.manager;
    }

    protected getRepository<T>(entityCls: new () => T): Repository<T> {
        return this.manager.getRepository(entityCls);
    }

    private applyCondition<T>(
        qb: WhereExpressionBuilder,
        column: string,
        op: string,
        value: any,
        param: string,
    ) {
        const operatorMap = {
            eq: '=',
            ne: '!=',
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
        };

        switch (op) {
            case 'like':
                qb.andWhere(`${column} LIKE :${param}`, {
                    [param]: `%${value}%`,
                });
                break;

            case 'startsWith':
                qb.andWhere(`${column} LIKE :${param}`, {
                    [param]: `${value}%`,
                });
                break;

            case 'endsWith':
                qb.andWhere(`${column} LIKE :${param}`, {
                    [param]: `%${value}`,
                });
                break;

            case 'in':
                qb.andWhere(`${column} IN (:...${param})`, { [param]: value });
                break;

            case 'notIn':
                qb.andWhere(`${column} NOT IN (:...${param})`, {
                    [param]: value,
                });
                break;

            case 'isNull':
                qb.andWhere(`${column} IS NULL`);
                break;

            case 'isNotNull':
                qb.andWhere(`${column} IS NOT NULL`);
                break;

            default:
                if (operatorMap[op]) {
                    qb.andWhere(`${column} ${operatorMap[op]} :${param}`, {
                        [param]: value,
                    });
                }
        }
    }

    private applyFilterNode<T>(
        qb: WhereExpressionBuilder,
        alias: string,
        node: any,
        allowedFields: string[],
        idx: { value: number },
    ) {
        if (node.AND) {
            qb.andWhere(
                new Brackets((qb2) => {
                    node.AND.forEach((n) =>
                        this.applyFilterNode(qb2, alias, n, allowedFields, idx),
                    );
                }),
            );
            return;
        }

        if (node.OR) {
            qb.andWhere(
                new Brackets((qb2) => {
                    node.OR.forEach((n, i) => {
                        qb2[i === 0 ? 'where' : 'orWhere'](
                            new Brackets((qb3) => {
                                this.applyFilterNode(
                                    qb3,
                                    alias,
                                    n,
                                    allowedFields,
                                    idx,
                                );
                            }),
                        );
                    });
                }),
            );
            return;
        }

        if (!allowedFields.includes(node.field)) return;

        const param = `val_${idx.value++}`;

        const column = node.field.includes('.')
            ? node.field
            : `${alias}.${node.field}`;

        this.applyCondition(qb, column, node.op, node.value, param);
    }

    protected applyFilters<T>(
        qb: SelectQueryBuilder<T>,
        alias: string,
        condition: FiltersDto,
        allowedFields: string[],
    ) {
        const idx = { value: 0 };

        // format ใหม่ (AND / OR tree)
        if (condition.AND || condition.OR) {
            this.applyFilterNode(qb, alias, condition, allowedFields, idx);
            return qb;
        }

        // format เดิม (backward compatible)
        condition.filters?.forEach((f) => {
            this.applyFilterNode(qb, alias, f, allowedFields, idx);
        });

        return qb;
    }
}
