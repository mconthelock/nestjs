import { Request } from 'express';
import { DataSource, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';
import { FiltersDto } from '../dto/filter.dto';

export class BaseRepository {
  constructor(
    private dataSource: DataSource,
    private request: Request,
  ) {}

  protected get manager(): EntityManager {
    return this.request[ENTITY_MANAGER_KEY] ?? this.dataSource.manager;
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

      switch (f.op) {
        case 'like':
          qb.andWhere(`${alias}.${f.field} LIKE :${param}`, {
            [param]: `%${f.value}%`,
          });
          break;

        case 'startsWith':
          qb.andWhere(`${alias}.${f.field} LIKE :${param}`, {
            [param]: `${f.value}%`,
          });
          break;

        case 'endsWith':
          qb.andWhere(`${alias}.${f.field} LIKE :${param}`, {
            [param]: `%${f.value}`,
          });
          break;

        case 'in':
          qb.andWhere(`${alias}.${f.field} IN (:...${param})`, {
            [param]: f.value,
          });
          break;
        
          case 'notIn':
          qb.andWhere(`${alias}.${f.field} NOT IN (:...${param})`, {
            [param]: f.value,
          });
          break;

        case 'isNull':
          qb.andWhere(`${alias}.${f.field} IS NULL`);
          break;

        case 'isNotNull':
          qb.andWhere(`${alias}.${f.field} IS NOT NULL`);
          break;

        default:
          if (operatorMap[f.op]) {
            qb.andWhere(`${alias}.${f.field} ${operatorMap[f.op]} :${param}`, {
              [param]: f.value,
            });
          }
      }
    });

    return qb;
  }
}
