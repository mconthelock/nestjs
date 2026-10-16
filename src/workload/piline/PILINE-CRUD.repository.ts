import {
    BadRequestException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import {
    DataSource,
    FindOptionsWhere,
    ObjectLiteral,
    QueryFailedError,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseRepository } from 'src/common/repositories/base-repository';

/** Shared write behavior for PILINE tables; uses the request transaction manager. */
export class PilineCrudRepository<
    T extends ObjectLiteral,
> extends BaseRepository {
    constructor(
        ds: DataSource,
        private readonly entity: new () => T,
    ) {
        super(ds);
    }

    private key(where: FindOptionsWhere<T>) {
        const columns = this.getRepository(this.entity).metadata.primaryColumns;
        if (
            columns.some(
                (column) =>
                    where[column.propertyName] === undefined ||
                    where[column.propertyName] === null ||
                    where[column.propertyName] === '',
            )
        ) {
            throw new BadRequestException(
                'All primary key fields are required',
            );
        }
        return Object.fromEntries(
            columns.map((column) => [
                column.propertyName,
                where[column.propertyName],
            ]),
        ) as FindOptionsWhere<T>;
    }

    private databaseError(error: unknown): never {
        if (error instanceof QueryFailedError) {
            const driver = error.driverError;
            const code = driver.errorNum ?? driver.errno;
            if ([1, 1062].includes(code))
                throw new ConflictException(
                    'Primary key or unique value already exists',
                );
            if ([2291, 2292, 1451, 1452].includes(code))
                throw new ConflictException(
                    'Referenced data does not exist or this record is still in use',
                );
            if (
                [
                    1400, 1407, 2290, 12899, 1438, 1048, 1406, 1264, 3819,
                ].includes(code)
            )
                throw new BadRequestException(
                    'Data violates a database constraint',
                );
        }
        throw error;
    }

    async findAll() {
        const repo = this.getRepository(this.entity);
        const isEvent = repo.metadata.tableName === 'PILINE_EVENT_RECORD';
        const data = await repo.find(
            isEvent
                ? {
                      take: 200,
                      order: { EVENT_DATE: 'DESC', RUN_NO: 'DESC' } as any,
                  }
                : {},
        );
        return { status: true, data };
    }

    async create(dto: Partial<T>) {
        const key = this.key(dto as FindOptionsWhere<T>);
        try {
            // insert must reject duplicate keys; save would silently update them.
            await this.getRepository(this.entity).insert(
                dto as QueryDeepPartialEntity<T>,
            );
            return { status: true, message: 'Created successfully', data: key };
        } catch (error) {
            this.databaseError(error);
        }
    }

    async update(where: FindOptionsWhere<T>, dto: Partial<T>) {
        const key = this.key(where);
        const fields = Object.fromEntries(
            Object.entries(dto).filter(([, value]) => value !== undefined),
        );
        if (Object.keys(fields).some((field) => field in key))
            throw new BadRequestException('Primary keys cannot be updated');
        if (!Object.keys(fields).length)
            throw new BadRequestException(
                'At least one non-key field is required',
            );
        try {
            const result = await this.getRepository(this.entity).update(
                key,
                fields as QueryDeepPartialEntity<T>,
            );
            if (result.affected === 0)
                throw new NotFoundException('Record not found');
            return { status: true, message: 'Updated successfully', data: key };
        } catch (error) {
            this.databaseError(error);
        }
    }

    async remove(where: FindOptionsWhere<T>) {
        const key = this.key(where);
        try {
            const result = await this.getRepository(this.entity).delete(key);
            if (result.affected === 0)
                throw new NotFoundException('Record not found');
            return { status: true, message: 'Deleted successfully', data: key };
        } catch (error) {
            this.databaseError(error);
        }
    }
}
