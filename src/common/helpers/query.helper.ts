import { FiltersDto } from 'src/common/dto/filter.dto';

function normalizeDateFilter(value: any, isEnd = false) {
    if (value instanceof Date) {
        const date = new Date(value);
        if (isEnd) {
            date.setHours(23, 59, 59, 999);
        } else {
            date.setHours(0, 0, 0, 0);
        }
        return date;
    }

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (isEnd) {
            date.setHours(23, 59, 59, 999);
        } else {
            date.setHours(0, 0, 0, 0);
        }
        return date;
    }

    return value;
}

export async function applyDynamicFilters(qb, filters: any, alias: string) {
    if (!filters) return;

    const directFilters: Array<{ key: string; value: any }> = [];
    const rangeFilters = new Map<string, { start?: any; end?: any }>();

    for (const key of Object.keys(filters)) {
        const value = filters[key];

        if (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            await applyDynamicFilters(qb, value, key);
            continue;
        }

        if (key.startsWith('START_') || key.startsWith('END_')) {
            const field = key.replace(/^START_/, '').replace(/^END_/, '');
            const currentRange = rangeFilters.get(field) ?? {};

            if (key.startsWith('START_')) currentRange.start = value;
            else currentRange.end = value;

            rangeFilters.set(field, currentRange);
            continue;
        }

        directFilters.push({ key, value });
    }

    for (const { key, value } of directFilters) {
        const visual_key = key;
        const paramName = `${alias}_${visual_key}_${Math.random().toString(36).substring(7)}`;
        const { sql, params } = await parseCondition(
            alias,
            visual_key,
            value,
            paramName,
        );

        if (sql) {
            const processedParams = {};
            for (const [paramKey, paramValue] of Object.entries(params)) {
                if (
                    typeof paramValue === 'string' &&
                    /^\d{4}-\d{2}-\d{2}/.test(paramValue)
                ) {
                    processedParams[paramKey] = normalizeDateFilter(
                        paramValue,
                        paramKey.includes('_end') || key.startsWith('END_'),
                    );
                } else {
                    processedParams[paramKey] = paramValue;
                }
            }
            qb.andWhere(sql, processedParams);
        }
    }

    for (const [field, range] of rangeFilters.entries()) {
        const hasStart = range.start !== undefined && range.start !== null;
        const hasEnd = range.end !== undefined && range.end !== null;

        if (!hasStart && !hasEnd) continue;

        const paramName = `${alias}_${field}_${Math.random().toString(36).substring(7)}`;
        const params: Record<string, any> = {};
        const conditions: string[] = [];

        if (hasStart) {
            params[`${paramName}_start`] = normalizeDateFilter(
                range.start,
                false,
            );
            conditions.push(`${alias}.${field} >= :${paramName}_start`);
        }

        if (hasEnd) {
            params[`${paramName}_end`] = normalizeDateFilter(range.end, true);
            conditions.push(`${alias}.${field} <= :${paramName}_end`);
        }

        if (conditions.length > 0) {
            qb.andWhere(conditions.join(' AND '), params);
        }
    }
}

// Helper to translate strings like "> 20 && < 30" into SQL
export async function parseCondition(
    alias: string,
    field: string,
    val: string | number | boolean | Date | null | undefined,
    pName: string,
) {
    const column = `${alias}.${field}`;

    if (val === null || val === undefined) {
        return {
            sql: `${column} IS NULL`,
            params: {},
        };
    }

    if (typeof val !== 'string') {
        // Handle Date objects as date range (entire day) to match timestamps in DB
        if (val instanceof Date) {
            const startOfDay = new Date(val);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(val);
            endOfDay.setHours(23, 59, 59, 999);

            return {
                sql: `${column} >= :${pName}_start AND ${column} <= :${pName}_end`,
                params: {
                    [`${pName}_start`]: startOfDay,
                    [`${pName}_end`]: endOfDay,
                },
            };
        }

        // For number/boolean, use exact match
        return {
            sql: `${column} = :${pName}`,
            params: { [pName]: val },
        };
    }

    // Range check: "> 20 && < 30"
    if (val.includes('&&')) {
        const [part1, part2] = val.split('&&').map((s) => s.trim());
        const op1 = await extractOp(part1);
        const op2 = await extractOp(part2);

        return {
            sql: `${column} ${op1.op} :${pName}_1 AND ${column} ${op2.op} :${pName}_2`,
            params: { [`${pName}_1`]: op1.val, [`${pName}_2`]: op2.val },
        };
    }

    // LIKE check: "LIKE '445'"
    if (val.toUpperCase().includes('LIKE')) {
        const cleanVal = val
            .replace(/LIKE/i, '')
            .replace(/'/g, '')
            .trim()
            .toUpperCase();
        return {
            sql: `${column} LIKE :${pName}`,
            params: { [pName]: `%${cleanVal}%` }, // Auto-wrapping in % for convenience
        };
    }

    // IS NULL check: "IS NULL"
    if (val.toUpperCase() === 'IS NULL') {
        return {
            sql: `${column} IS NULL`,
            params: {},
        };
    }

    // Standard Operator check: "> 20" or "<= 2025-12-11"
    const opData = await extractOp(val);
    return {
        sql: `${column} ${opData.op} :${pName}`,
        params: { [pName]: opData.val },
    };
}

export async function extractOp(str: string) {
    const operators = ['>=', '<=', '>', '<', '='];
    const op = operators.find((o) => str.startsWith(o)) || '=';
    const val = str.replace(op, '').trim();
    return { op, val };
}

export async function parseConditionString(condition: FiltersDto) {
    const operatorMap = {
        eq: '=',
        ne: '!=',
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<=',
    };

    let query = '';
    condition.filters.forEach((f, i) => {
        const and = query != '' ? 'AND' : '';
        let sep;
        switch (f.type) {
            case 'number':
                sep = '';
                break;
            default:
                sep = `'`;
                break;
        }

        switch (f.op) {
            case 'like':
                query += ` ${and} ${f.field} LIKE '%${f.value}%'`;
                break;

            case 'startsWith':
                query += ` ${and} ${f.field} LIKE '${f.value}%'`;
                break;

            case 'endsWith':
                query += ` ${and} ${f.field} LIKE '%${f.value}'`;
                break;

            case 'in':
                let inValues = '';
                if (Array.isArray(f.value))
                    inValues = f.value
                        .map((v) => `${sep}${v}${sep}`)
                        .join(', ');
                query += ` ${and} ${f.field} IN (${inValues})`;
                break;

            case 'notIn':
                let notInValues = '';
                if (Array.isArray(f.value))
                    notInValues = f.value
                        .map((v) => `${sep}${v}${sep}`)
                        .join(', ');
                query += ` ${and} ${f.field} NOT IN (${notInValues})`;
                break;

            case 'isNull':
                query += ` ${and} ${f.field} IS NULL`;
                break;

            case 'isNotNull':
                query += ` ${and} ${f.field} IS NOT NULL`;
                break;

            default:
                if (operatorMap[f.op]) {
                    query += ` ${and} ${f.field} ${operatorMap[f.op]} ${sep}${f.value}${sep}`;
                }
        }
    });
    return query !== '' ? ` WHERE ${query}` : '';
}

export async function parseCreateString(condition: FiltersDto, table: string) {
    let column = '',
        values = '';
    condition.filters.forEach((f, i) => {
        let sep;
        switch (f.type) {
            case 'number':
                sep = '';
                break;
            default:
                sep = `'`;
                break;
        }
        column += `${i > 0 ? ', ' : ''}${f.field}`;
        values += `${i > 0 ? ', ' : ''}${sep}${f.value}${sep}`;
    });
    return `INSERT INTO ${table} (${column}) VALUES (${values})`;
}
