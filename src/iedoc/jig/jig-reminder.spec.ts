import { JigReminderService } from './jig-reminder.service';

describe('JIG inspection reminders', () => {
    const row = { JIG_NO: 'J26-001', JIG_NAME: '<JIG>', PIC_EMPNO: '12345',
        DUE_DATE: '01/11/2026', DAYS_UNTIL_DUE: 30, SNAME: 'Controller',
        SRECMAIL: 'controller@example.com', SSECCODE: 'SEC001', SDEPCODE: 'DEP001' };
    let query: jest.Mock;
    let sendMail: jest.Mock;
    let service: JigReminderService;
    beforeEach(() => {
        query = jest.fn(async (sql: string, binds: string[]) => sql.includes('IEDOC.JIG_MASTER') ? [row]
            : [{ SEMPNO: binds[1], SNAME: `Manager ${binds[1]}`, SRECMAIL: `manager${binds[1]}@example.com` }]);
        sendMail = jest.fn().mockResolvedValue({ rejected: [] });
        service = new JigReminderService({ query } as any, { sendMail } as any);
    });
    it('resolves CC from the controller section/department and previews without sending', async () => {
        const result = await service.send({ date: '02/10/2026', dryRun: true });
        expect(query.mock.calls[1][1]).toEqual(['SEC001', '30']);
        expect(query.mock.calls[2][1]).toEqual(['DEP001', '20']);
        expect(query.mock.calls[0][1]).toEqual(['02/10/2026', '02/10/2026', '02/10/2026']);
        expect(result.summary.preview).toBe(1);
        expect(result.items[0].html).toContain('&lt;JIG&gt;');
        expect(result.items[0].originalRecipients.cc1[0].SNAME).toBe('Manager 30');
        expect(sendMail).not.toHaveBeenCalled();
    });
    it.each([30, 14, 7, -1, -400])('sends qualifying day %s', async days => {
        query.mockResolvedValueOnce([{ ...row, DAYS_UNTIL_DUE: days }]);
        const result = await service.send({});
        expect(result.summary.sent).toBe(1);
        expect(result.items[0].subject).toContain(days < 0 ? 'OVERDUE' : `${days} Days`);
    });
    it.each([31, 15, 8, 1, 0])('does not send on day %s', async days => {
        query.mockResolvedValueOnce([{ ...row, DAYS_UNTIL_DUE: days }]);
        expect((await service.send({})).summary.total).toBe(0);
        expect(sendMail).not.toHaveBeenCalled();
    });
    it('overrides TO and clears CC without losing original recipient names', async () => {
        const result = await service.send({ to: ['test@example.com'], cc: [] });
        expect(sendMail.mock.calls[0][0]).toMatchObject({ to: ['test@example.com'], cc: [] });
        expect(result.items[0].originalRecipients.to.SNAME).toBe('Controller');
    });
    it('skips missing recipients', async () => {
        query.mockResolvedValueOnce([{ ...row, SRECMAIL: null }]);
        expect((await service.send({})).summary.skipped).toBe(1);
        expect(sendMail).not.toHaveBeenCalled();
    });
    it('continues after a mail failure', async () => {
        query.mockResolvedValueOnce([row, { ...row, JIG_NO: 'J26-002' }]);
        sendMail.mockRejectedValueOnce(new Error('SMTP unavailable'));
        expect((await service.send({})).summary).toMatchObject({ sent: 1, failed: 1 });
    });
    it('rejects impossible dates before querying', async () => {
        await expect(service.send({ date: '31/02/2026' })).rejects.toThrow('Invalid calendar date');
        expect(query).not.toHaveBeenCalled();
    });
    it('uses Bangkok calendar date at UTC day boundary', async () => {
        jest.useFakeTimers().setSystemTime(new Date('2026-10-05T18:00:00Z'));
        try { expect((await service.send({ dryRun: true })).asOf).toBe('06/10/2026'); }
        finally { jest.useRealTimers(); }
    });
});
