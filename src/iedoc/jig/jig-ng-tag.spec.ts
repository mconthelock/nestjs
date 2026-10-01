import { ngTagHtml, tagDate } from './jig-ng-tag.service';

const data = {
    form: { JIG_NO: 'J26-017', JIG_NAME: '<script>alert(1)</script>', PROCESS_CODE: 'K4', ITEMNO: '131', LOCATION: 'K4 LINE' },
    ng: { DEFECT_DETAIL: 'Defect', ACTION: 'MODIFY', CORRECTIVE: 'Adjust', PLAN_DATE: '2026-04-30' },
    checkDate: '2026-04-18',
    stamps: [
        { CSTEPNO: '--', CAPVSTNO: '1', DAPVDATE: '2026-04-18', SNAME: 'SAMART SURNAME', SSEC: 'IPE SEC.' },
        { CSTEPNO: '06', CAPVSTNO: '0', DAPVDATE: null, SNAME: 'UNAPPROVED PERSON' },
    ],
};

describe('Jig NG tag template', () => {
    it('escapes database text and prints the requested fields', () => {
        const html = ngTagHtml(data, '', '');
        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
        for (const text of ['J26-017', 'K4', '131', 'ITEM:', '30/04/2026', 'size:A5 portrait']) expect(html).toContain(text);
    });
    it('only stamps completed approvals and takes the first name', () => {
        const html = ngTagHtml(data, '', '');
        expect(html).toContain('SAMART');
        expect(html).not.toContain('SURNAME');
        expect(html).not.toContain('UNAPPROVED');
        expect(html.match(/pending-text">PENDING/g)).toHaveLength(2);
        expect(html).toContain('IPE SEC.');
    });
    it('handles names without spaces and keeps action boxes for unknown values', () => {
        const html = ngTagHtml({ ...data, ng: { ...data.ng, ACTION: 'Repair & check' },
            stamps: [{ CSTEPNO: '07', CAPVSTNO: '1', DAPVDATE: '2026-04-21', SNAME: 'SOMCHAI', SSEC: 'MFG SEC.' }] }, '', '');
        expect(html).toContain('SOMCHAI');
        expect(html).toContain('MFG SEC.');
        expect(html).not.toContain('K4 LINE');
        for (const action of ['ADJUST', 'MODIFY', 'REPLACE']) expect(html).toContain(`<i></i>${action}`);
    });
    it.each([
        ['Adjust,Modify', ['ADJUST', 'MODIFY']],
        [' adjust , Modify\u00a0,REPLACE,adjust,', ['ADJUST', 'MODIFY', 'REPLACE']],
        ['MODIFY', ['MODIFY']],
        ['', []],
        [null, []],
    ])('checks comma-separated actions: %s', (action, selected) => {
        const html = ngTagHtml({ ...data, ng: { ...data.ng, ACTION: action } }, '', '');
        for (const label of ['ADJUST', 'MODIFY', 'REPLACE']) {
            expect(html).toContain(`<i>${selected.includes(label) ? 'X' : ''}</i>${label}`);
        }
    });
    it('uses Thai calendar dates rather than the UTC date', () => {
        expect(tagDate('2026-04-17T17:00:00Z')).toBe('18/04/2026');
        expect(tagDate(null)).toBe('-');
    });
});
