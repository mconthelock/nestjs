import { applyDynamicFilters } from './query.helper';

describe('applyDynamicFilters', () => {
    it('combines START_ and END_ filters for the same field into one date range', async () => {
        const qb: any = {
            andWhere: jest.fn(),
        };

        await applyDynamicFilters(
            qb,
            {
                EMPNO: '12069',
                START_FRMLVDATE: '2025-12-10',
                END_FRMLVDATE: '2026-12-09',
            },
            'lvapp',
        );

        expect(qb.andWhere).toHaveBeenCalledTimes(2);

        const employeeCall = qb.andWhere.mock.calls[0];
        const dateRangeCall = qb.andWhere.mock.calls[1];

        expect(employeeCall[0]).toContain('lvapp.EMPNO');

        expect(dateRangeCall[0]).toMatch(
            /lvapp\.FRMLVDATE >= :.+_start AND lvapp\.FRMLVDATE <= :.+_end/,
        );

        const paramValues = Object.values(
            dateRangeCall[1] as Record<string, unknown>,
        );
        expect(paramValues).toHaveLength(2);
        expect(paramValues.every((value) => value instanceof Date)).toBe(true);
        expect((paramValues[0] as Date).getHours()).toBe(0);
        expect((paramValues[1] as Date).getHours()).toBe(23);
    });
});
