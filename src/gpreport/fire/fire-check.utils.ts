import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryFailedError } from 'typeorm';

export async function validateCheckDto<T extends object>(type: new () => T, input: T): Promise<T> {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new BadRequestException('INVALID_FIRE_CHECK_INPUT');
    }
    const dto = plainToInstance(type, input);
    const errors = await validate(dto, { whitelist: true, forbidUnknownValues: true });
    if (errors.length) {
        throw new BadRequestException(errors.flatMap(error => Object.values(error.constraints ?? {})));
    }
    // Oracle VARCHAR2 declarations use byte limits in the supplied DDL.
    const lengths = { VORGNO: 6, CYEAR: 2, CYEAR2: 4, AREA: 100, FMONTH: 2, FYEAR: 4,
        FIRE_CODE: 20, GAGE: 20, PIN: 20, HOSE: 20, CLEAN: 20, DETAIL: 500 };
    for (const [field, length] of Object.entries(lengths)) {
        const value = (dto as Record<string, unknown>)[field];
        if (typeof value === 'string' && Buffer.byteLength(value, 'utf8') > length) {
            throw new BadRequestException(`${field} must not exceed ${length} bytes`);
        }
        // Oracle pads CHAR storage, while VARCHAR2 string binds do not.
        // Pad the key to the same byte width for consistent equality checks.
        if (typeof value === 'string' && (field === 'CYEAR' || field === 'CYEAR2')) {
            (dto as Record<string, unknown>)[field] = value + ' '.repeat(length - Buffer.byteLength(value, 'utf8'));
        }
    }
    return dto;
}

export function validateCheckPagination(query: { page: number; limit: number }) {
    if (query.page == null || query.limit == null) {
        throw new BadRequestException('INVALID_FIRE_CHECK_PAGINATION');
    }
}

export function requireCheckChanges(data: object) {
    if (!Object.values(data).some(value => value !== undefined)) {
        throw new BadRequestException('NO_FIELDS_TO_UPDATE');
    }
}

export async function checkOperation<T>(work: () => Promise<T>, duplicateMessage = 'FIRE_CHECK_ALREADY_EXISTS'): Promise<T> {
    try {
        return await work();
    } catch (error) {
        const driver = error?.driverError ?? error;
        if (driver?.errorNum === 1 || driver?.code === 'ORA-00001') {
            throw new ConflictException(duplicateMessage);
        }
        if (error instanceof QueryFailedError) {
            throw new InternalServerErrorException('FIRE_CHECK_DATABASE_ERROR');
        }
        throw error;
    }
}
