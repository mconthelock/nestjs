import { JigFlowService } from './jig-flow.service';
import { JigRepository } from './jig.repository';
import { JigFormNg } from 'src/common/Entities/iedoc/table/jig_form_ng.entity';
import { JigFormFile } from 'src/common/Entities/iedoc/table/jig_form_file.entity';
import { transactionContext } from 'src/common/interceptors/transaction-context';
const key = { NFRMNO: 31, VORGNO: '051401', CYEAR: '26', CYEAR2: '2026', NRUNNO: 4 };

function flowFixture(hasNg = true, present = ['07', '19', '85']) {
    let rows: any[] = [
        { CSTEPNO: '--', CSTEPNEXTNO: '06', VAPVNO: 'R', VREPNO: 'RR' },
        { CSTEPNO: '06', CSTEPNEXTNO: present[0] || '04', VAPVNO: 'S', VREPNO: 'SR' },
        ...present.map((step, i) => ({ CSTEPNO: step, CSTEPNEXTNO: present[i + 1] || '04', VAPVNO: 'OLD', VREPNO: 'OLDREP' })),
        { CSTEPNO: '04', CSTEPNEXTNO: '04' },
    ];
    const manager = { query: jest.fn(async (sql: string) => {
        if (sql.includes('SELECT CST')) return [{ CST: '1' }];
        if (sql.includes('SELECT JIG_NO')) return [{ JIG_NO: 'J26-006' }];
        if (sql.includes('JIG_FORM_NG')) return hasNg ? [{}] : [];
        return [{ MIN: -0.1, MAX: 0.1, MEASURED_VALUE: 0.05 }];
    }) };
    let committed = false;
    const ds = { transaction: jest.fn(async fn => {
        const before = structuredClone(rows);
        try { const result = await fn(manager); committed = true; return result; }
        catch (error) { rows = before; throw error; }
    }) };
    const flows = {
        getFlow: jest.fn(async dto => rows.filter(r => !dto.CSTEPNO || r.CSTEPNO === dto.CSTEPNO)),
        updateFlow: jest.fn(async ({ condition, ...values }) => { rows.filter(r => r.CSTEPNO === condition.CSTEPNO).forEach(r => Object.assign(r, values)); }),
    };
    const insert = { insertFlowStep: jest.fn(async dto => {
        expect(transactionContext.getStore().manager).toBe(manager);
        const previous = rows.find(r => r.CSTEPNO === dto.BEFORESTEPNO);
        expect(previous.CSTEPNEXTNO).not.toBe(dto.NEWSTEPNO); // No transient self-loop.
        rows.push({ CSTEPNO: dto.NEWSTEPNO, CSTEPNEXTNO: previous.CSTEPNEXTNO, VAPVNO: dto.APVNO });
        previous.CSTEPNEXTNO = dto.NEWSTEPNO;
        return { status: true };
    }) };
    const remove = { deleteFlowStep: jest.fn(async dto => {
        const target = rows.find(r => r.CSTEPNO === dto.CSTEPNO);
        rows.filter(r => r.CSTEPNEXTNO === target.CSTEPNO).forEach(r => { r.CSTEPNEXTNO = target.CSTEPNEXTNO; });
        rows = rows.filter(r => r !== target); return { status: true };
    }) };
    return { service: new JigFlowService(ds as any, flows as any, insert as any, remove as any),
        insert, remove, manager, rows: () => rows, committed: () => committed };
}

describe('JIG NG flow via shared services', () => {
    it.each([[], ['07'], ['19'], ['85'], ['07','85'], ['19','85'], ['07','19'], ['07','19','85']])('restores ordered flow for existing steps %j', async (...args) => {
        // Jest expands array cases; use the expanded values as the existing list.
        const existing = args.filter(v => typeof v === 'string');
        const f = flowFixture(true, existing);
        await f.service.configure(key, 'FOREMAN');
        const step = (id: string) => f.rows().find(r => r.CSTEPNO === id);
        expect(['06','07','19','85'].map(s => step(s).CSTEPNEXTNO)).toEqual(['07','19','85','04']);
        expect(step('19')).toMatchObject({ VAPVNO: 'R', VREPNO: 'RR' });
        expect(step('85')).toMatchObject({ VAPVNO: 'S', VREPNO: 'SR' });
        expect(step('07')).toMatchObject({ VAPVNO: 'FOREMAN', VREPNO: 'FOREMAN' });
        const count = f.insert.insertFlowStep.mock.calls.length;
        await f.service.configure(key, 'NEWFOREMAN');
        expect(f.insert.insertFlowStep).toHaveBeenCalledTimes(count);
    });
    it('removes all NG steps and reconnects 06 to 04 without duplicate deletes', async () => {
        const f = flowFixture(false);
        await f.service.configure(key);
        expect(f.remove.deleteFlowStep.mock.calls.map(([d]) => d.CSTEPNO)).toEqual(['85','19','07']);
        expect(f.rows().find(r => r.CSTEPNO === '06').CSTEPNEXTNO).toBe('04');
        await f.service.configure(key);
        expect(f.remove.deleteFlowStep).toHaveBeenCalledTimes(3);
    });
    it('rolls back Flow changes if insertion fails', async () => {
        const f = flowFixture(true, []);
        f.insert.insertFlowStep.mockRejectedValueOnce(new Error('Insert failed'));
        await expect(f.service.configure(key, 'F')).rejects.toThrow('Insert failed');
        expect(f.committed()).toBe(false);
        expect(f.rows().find(r => r.CSTEPNO === '06').CSTEPNEXTNO).toBe('04');
    });
    it('requires PICCODE when an NG record exists even if measured values are OK', async () => {
        await expect(flowFixture().service.configure(key)).rejects.toThrow('PICCODE');
    });
});

function recheckFixture() {
    const ng = { DEFECT_DETAIL: 'Defect', ACTION: 'Adjust', CORRECTIVE: 'Repair' };
    const files: any[] = [{ FILE_SEQ: 1, FILE_GROUP: null, FILE_PATH: 'reference.jpg' }];
    const manager: any = { query: jest.fn().mockResolvedValue([{ CSTEPNO: '19' }]),
        findOneBy: jest.fn(async entity => entity === JigFormNg ? ng : null),
        findBy: jest.fn(async entity => entity === JigFormFile ? files : []),
        create: jest.fn((_entity, row) => row), save: jest.fn(), update: jest.fn() };
    const repo = new JigRepository({} as any);
    (repo as any).withForm = async (_key, callback) => callback(manager, {}, {}, '1');
    const dto: any = { UPDATE_BY: 'R', ACTUAL_FINNISH_DATE: '2026-10-16', SUMMARY_DETAIL: 'Repaired and rechecked',
        FILES: ['BEFORE','AFTER'].map((group, i) => ({ FILE_SEQ: i + 2, FILE_GROUP: group,
            FILE_NAME: 'photo.jpg', FILE_PATH: `IE-JIG26-000004/${group}/photo.jpg`, FILE_TYPE: 'image/jpeg', FILE_SIZE: 100 })) };
    jest.spyOn(repo, 'getForm').mockResolvedValue({} as any);
    return { repo, manager, dto, files };
}
describe('JIG Job Controller recheck', () => {
    it('writes only recheck data and grouped files, leaving Header and reference attachments intact', async () => {
        const { repo, manager, dto } = recheckFixture();
        await repo.saveRecheck(key, dto);
        expect(manager.update).toHaveBeenCalledTimes(1);
        expect(manager.update).toHaveBeenCalledWith(JigFormNg, key, { ACTUAL_FINNISH_DATE: new Date('2026-10-16'), SUMMARY_DETAIL: dto.SUMMARY_DETAIL });
        expect(manager.save).toHaveBeenCalledTimes(2);
    });
    it('rejects callers outside active step 19', async () => {
        const { repo, manager, dto } = recheckFixture(); manager.query.mockResolvedValue([]);
        await expect(repo.saveRecheck(key, dto)).rejects.toThrow('active step 19');
        expect(manager.save).not.toHaveBeenCalled();
    });
    it.each(['BEFORE','AFTER'])('requires at least one %s image', async group => {
        const { repo, dto } = recheckFixture(); dto.FILES = dto.FILES.filter(f => f.FILE_GROUP !== group);
        await expect(repo.saveRecheck(key, dto)).rejects.toThrow(`${group} requires`);
    });
    it('rejects sequence collisions with a reference file', async () => {
        const { repo, dto } = recheckFixture(); dto.FILES[0].FILE_SEQ = 1;
        await expect(repo.saveRecheck(key, dto)).rejects.toThrow('sequence has changed');
    });
    it('rejects files from another form or group', async () => {
        const { repo, dto } = recheckFixture(); dto.FILES[0].FILE_PATH = 'IE-JIG26-000005/BEFORE/photo.jpg';
        await expect(repo.saveRecheck(key, dto)).rejects.toThrow('image metadata');
    });
});
