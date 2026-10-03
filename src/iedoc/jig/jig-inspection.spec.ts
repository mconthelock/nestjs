import { JigInspectionService, inspectionDate } from './jig-inspection.service';
import { transactionContext } from 'src/common/interceptors/transaction-context';

const key = { NFRMNO: 31, VORGNO: '051401', CYEAR: '26', CYEAR2: '2026', NRUNNO: 2 };
function setup(points = [{ CHECK_SEQ: 1, CHECK_POINT: 'Visual', MEASURED_VALUE: 1.2345 }] as any[]) {
    const state = { history: [] as any[], ng: [] as any[], fail: false, committed: false };
    const master = { JIG_NO: 'J26-001', PIC_EMPNO: '14077', REV: '0', JIG_NAME: 'Jig', INSPEC_PERIOD: 6 };
    const query = jest.fn(async (sql: string, params?: any[]) => {
        if (sql.startsWith('SELECT JIG_NO')) return [{ JIG_NO: master.JIG_NO }];
        if (sql.startsWith('SELECT * FROM IEDOC.JIG_MASTER')) return [master];
        if (sql.startsWith('SELECT F.CYEAR2')) return state.history;
        if (sql.startsWith('SELECT * FROM IEDOC.JIG_CHECKPOINT')) return points;
        if (sql.startsWith('SELECT * FROM IEDOC.JIG_DEFECT_NG')) return state.ng;
        if (state.fail && sql.startsWith('INSERT INTO IEDOC.JIG_FORM_DETAIL')) throw new Error('Insert failed');
        return [];
    });
    const manager = { query };
    const ds: any = { manager, transaction: jest.fn(async (callback) => {
        const result = await callback(manager);
        state.committed = true;
        return result;
    }) };
    const forms: any = { create: jest.fn(async () => {
        expect(transactionContext.getStore()?.manager).toBe(manager);
        return { status: true, data: key };
    }) };
    return { state, query, forms, service: new JigInspectionService(ds, forms) };
}

describe('Auto inspection', () => {
    it.each([
        { MIN: -0.11, MAX: 0.11, MEASURED_VALUE: -0.11 },
        { MIN: -1.2345, MAX: -0.0001, MEASURED_VALUE: -0.1234 },
        { MIN: 0, MAX: 0, MEASURED_VALUE: 0 },
        { MIN: -99999999.9999, MAX: 99999999.9999, MEASURED_VALUE: 99999999.9999 },
        { MIN: null, MAX: null, MEASURED_VALUE: null },
    ])('preserves checkpoint numeric values exactly in insert binds: %j', async (numeric) => {
        const { service, query } = setup([{ CHECK_SEQ: 1, CHECK_POINT: 'Dimension', ...numeric }]);
        expect((await service.run('01/03/2026')).created).toBe(1);
        const [sql, binds] = query.mock.calls.find(([sql]) => sql.startsWith('INSERT INTO IEDOC.JIG_FORM_DETAIL'))!;
        const columns = sql.match(/"([A-Z0-9_]+)"/g)!.map((c) => c.slice(1, -1));
        for (const field of ['MIN', 'MAX', 'MEASURED_VALUE']) {
            expect(binds![columns.indexOf(field)]).toBe(numeric[field]);
        }
    });
    it.each(['31/02/2026', '29/02/2025', '2026-03-01', '1/3/2026', '01/13/2026'])('rejects invalid date %s', (date) => {
        expect(() => inspectionDate(date)).toThrow();
    });
    it('supports leap dates and a historical year', () => {
        expect(inspectionDate('29/02/2024')).toBe('2024-02-29');
        expect(inspectionDate('01/03/2026')).toBe('2026-03-01');
    });
    it('creates inspection snapshots via WEBFORM and leaves results and master unchanged', async () => {
        const { service, query, forms, state } = setup();
        const result = await service.run('01/03/2026', '127.0.0.1');
        expect(result.created).toBe(1);
        expect(state.committed).toBe(true);
        expect(forms.create).toHaveBeenCalledWith(expect.objectContaining({ NFRMNO: 31, VORGNO: '051401', CYEAR: '26', REQBY: '14077', INPUTBY: '14077', DRAFT: '1' }), '127.0.0.1');
        expect(query.mock.calls[0][1]).toEqual(['2026-03-01']);
        const inserts = query.mock.calls.filter(([sql]) => sql.startsWith('INSERT'));
        expect(inserts).toHaveLength(2);
        expect(inserts[0][1]).toContain('INSPECTION');
        const headerColumns = inserts[0][0].match(/"([A-Z0-9_]+)"/g).map((c) => c.slice(1, -1));
        expect(inserts[0][1][headerColumns.indexOf('REV_OLD')]).toBe('0');
        expect(inserts[0][1][headerColumns.indexOf('REV')]).toBe('0');
        expect(inserts[1][0]).toContain('"MEASURED_VALUE"');
        expect(inserts[1][1].slice(-2)).toEqual([1.2345, null]);
        expect(query.mock.calls.some(([sql]) => /JIG_FORM_FILE|UPDATE IEDOC.JIG_MASTER|DELETE.*FLOW/.test(sql))).toBe(false);
    });
    it('copies NG and assigns the responsible person to step 07', async () => {
        const { service, query, state } = setup();
        state.ng = [{ DEFECT_DETAIL: 'Defect', ACTION: 'Repair', CORRECTIVE: 'Adjust', PLAN_DATE: new Date() }];
        expect((await service.run('01/03/2026')).created).toBe(1);
        expect(query.mock.calls.some(([sql]) => sql.startsWith('INSERT INTO IEDOC.JIG_FORM_NG'))).toBe(true);
        expect(query.mock.calls.find(([sql]) => sql.startsWith('UPDATE WEBFORM.FLOW'))[1]).toEqual(['14077', '14077', 31, '051401', '26', '2026', 2]);
    });
    it('skips an existing unresolved form before allocating another WEBFORM', async () => {
        const { service, state, forms } = setup();
        state.history = [{ ...key, CST: '1' }];
        expect((await service.run('01/03/2026')).skipped).toBe(1);
        expect(forms.create).not.toHaveBeenCalled();
    });
    it('does not commit on snapshot failure and reports the failed jig', async () => {
        const { service, state } = setup();
        state.fail = true;
        expect((await service.run('01/03/2026')).failed).toBe(1);
        expect(state.committed).toBe(false);
    });
});
