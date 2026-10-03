import { JigRepository } from './jig.repository';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigDelForm } from 'src/common/Entities/iedoc/table/jigdel_form.entity';
const key = { NFRMNO: 32, VORGNO: '051401', CYEAR: '26', CYEAR2: '2026', NRUNNO: 4 };
const values = [32, '051401', '26', '2026', 4];
function setup(status = '0', jigStatus = 'ACTIVE') {
    const manager = {
        find: jest.fn().mockResolvedValue([{ JIG_NO: 'J26-001', PIC_EMPNO: '15199', JIG_STATUS: jigStatus }]),
        findOneBy: jest.fn().mockResolvedValue(null),
        insert: jest.fn(), update: jest.fn(),
        query: jest.fn(async (sql: string): Promise<any[]> => {
            if (sql.startsWith('SELECT CST')) return [{ CST: status }];
            if (sql.startsWith('SELECT VINPUTER')) return [{ VINPUTER: '16001' }];
            if (sql.includes('SELECT DISTINCT TRIM(HEADNO)')) return [{ HEADNO: '14077' }];
            if (sql.startsWith('SELECT CSTEPNO')) return [{ CSTEPNO: '06' }];
            return [];
        }),
    };
    const ds = { manager, transaction: jest.fn((fn) => fn(manager)) };
    return { repo: new JigRepository(ds as any), manager };
}
describe('JIG deletion workflow', () => {
    it('inserts the snapshot, assigns HEADNO to all matching flow rows and marks pending', async () => {
        const { repo, manager } = setup();
        await repo.createDeleteForm({ ...key, JIG_NO: 'J26-001', REASON: 'Obsolete' });
        expect(manager.insert).toHaveBeenCalledWith(JigDelForm, { ...key, JIG_NO: 'J26-001', REASON: 'Obsolete', DETAIL: null });
        expect(manager.query).toHaveBeenCalledWith(expect.stringContaining('SELECT VINPUTER FROM WEBFORM.FORM'), values);
        expect(manager.query).toHaveBeenCalledWith(expect.stringContaining('FROM WEBFORM.SEQUENCEORG'), ['16001']);
        expect(manager.query).toHaveBeenCalledWith(
            "UPDATE WEBFORM.FLOW SET VAPVNO = :1, VREPNO = :2 WHERE NFRMNO = :3 AND VORGNO = :4 AND CYEAR = :5 AND CYEAR2 = :6 AND NRUNNO = :7 AND CEXTDATA = '02'",
            ['14077', '14077', ...values],
        );
        expect(manager.update).toHaveBeenCalledWith(JigMaster, { JIG_NO: 'J26-001' }, { JIG_STATUS: 'PENDING_DELETE' });
    });
    it.each([{ heads: [] }, { heads: [{ HEADNO: '1' }, { HEADNO: '2' }] }])('rejects missing or ambiguous HEADNO', async ({ heads }) => {
        const { repo, manager } = setup();
        const query = manager.query.getMockImplementation()!;
        manager.query.mockImplementation(async (sql) => sql.includes('SELECT DISTINCT') ? heads : query(sql));
        await expect(repo.createDeleteForm({ ...key, JIG_NO: 'J26-001' })).rejects.toThrow('HEADNO');
        expect(manager.insert).not.toHaveBeenCalled();
    });
    it('rejects a second deletion request', async () => {
        const { repo } = setup('0', 'PENDING_DELETE');
        await expect(repo.createDeleteForm({ ...key, JIG_NO: 'J26-001' })).rejects.toThrow('ACTIVE');
    });
    it.each([['finish', '2', 'DELETED'], ['reject', '3', 'ACTIVE']])('applies %s using stored workflow state', async (outcome, status, target) => {
        const { repo, manager } = setup(status, 'PENDING_DELETE');
        manager.findOneBy.mockResolvedValue({ ...key, JIG_NO: 'J26-001' });
        await repo.completeDeleteForm(key, outcome as 'finish' | 'reject');
        expect(manager.update).toHaveBeenCalledWith(JigMaster, { JIG_NO: 'J26-001' }, { JIG_STATUS: target });
    });
    it('does not finish an unapproved form', async () => {
        const { repo, manager } = setup('1', 'PENDING_DELETE');
        manager.findOneBy.mockResolvedValue({ ...key, JIG_NO: 'J26-001' });
        await expect(repo.completeDeleteForm(key, 'finish')).rejects.toThrow('WEBFORM status');
        expect(manager.update).not.toHaveBeenCalled();
    });
    it('does not let an old rejected form restore a newer pending deletion', async () => {
        const { repo, manager } = setup('3', 'PENDING_DELETE');
        manager.findOneBy.mockResolvedValue({ ...key, JIG_NO: 'J26-001' });
        const query = manager.query.getMockImplementation()!;
        manager.query.mockImplementation(async (sql) => sql.startsWith('SELECT D.NRUNNO') ? [{ NRUNNO: 5 }] : query(sql));
        await expect(repo.completeDeleteForm(key, 'reject')).rejects.toThrow('Another delete form');
        expect(manager.update).not.toHaveBeenCalled();
    });
});
