import { FireInspection } from './fire-inspection';
import * as XLSX from 'xlsx';

describe('Fire inspection compatibility', () => {
    const inspection = new FireInspection();
    const master = [{ FIRE_CODE: 'STF-03 D', LOCATION: 'A' }, { FIRE_CODE: '002', LOCATION: null }] as any;
    it('compares only J..BE, uses last parentheses, deduplicates and retains invalid rows', () => {
        const report = inspection.compareRows([
            { sheet: 'One', row: 2, date: '11/10/2026', cells: { I: '(ignored)', J: '(old) name (STF-03 D)', BE: '(002)', BF: '(ignored)' } },
            { sheet: 'Two', row: 3, date: '11/11/2026', cells: { J: '(002)', K: '(999)', L: 'invalid' } },
            { sheet: 'Two', row: 4, date: '02/30/2026', cells: { J: '(002)' } },
            { sheet: 'Two', row: 5, date: '10/10/2026', cells: { J: '(other)' } },
        ], '2026-11', master);
        expect(report).toEqual({month: '2026-11', master_count: 2, matched_rows: 2, found_count: 3, matched_count: 2,
            missing: [], unexpected: ['999'], invalid_cells: [{sheet: 'Two', row: 3, column: 'L', value: 'invalid'}],
            invalid_dates: [{sheet: 'Two', row: 4, value: '02/30/2026'}], complete: false});
    });
    it('returns all active masters as missing when the selected month has no data', () => {
        expect(inspection.compareRows([], '2026-11', master)).toMatchObject({missing: master, matched_rows: 0, complete: false});
    });
    for (const bookType of ['xlsx', 'biff8'] as const) {
        it(`reads ${bookType} worksheets, serial dates, numeric codes and boundaries`, () => {
            const book = XLSX.utils.book_new();
            const values: any[][] = [[], []];
            values[0][6] = 'Date'; values[0][9] = 'Code';
            values[1][6] = {t: 'n', v: 46336, z: 'mm/dd/yyyy'}; // 2026-11-10
            values[1][8] = '(ignored)'; values[1][9] = 'name (STF-03 D)'; values[1][56] = '(002)'; values[1][57] = '(ignored)';
            XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(values), 'Thai');
            const buffer = XLSX.write(book, {type: 'buffer', bookType});
            const rows = inspection.readExcel(buffer);
            expect(rows).toHaveLength(1);
            expect(rows[0]).toMatchObject({sheet: 'Thai', row: 2, date: '11/10/2026', cells: {J: 'name (STF-03 D)', BE: '(002)'}});
            expect(inspection.compareRows(rows, '2026-11', master).complete).toBe(true);
        });
    }
    it('converts numeric serials in text date cells as the PHP reader does', () => {
        const book=XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['header'],[null,null,null,null,null,null,'46336',null,null,'(002)']]),'One');
        const rows=inspection.readExcel(XLSX.write(book,{type:'buffer',bookType:'xlsx'}));
        expect(rows[0].date).toBe('11/10/2026');
    });
    it('keeps Excel error values visible as invalid cells instead of discarding them', () => {
        const book=XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['header'],[null,null,null,null,null,null,'11/10/2026',null,null,{t:'e',v:7}]]),'One');
        const rows=inspection.readExcel(XLSX.write(book,{type:'buffer',bookType:'xlsx'}));
        expect(rows[0].cells.J).toBe('#DIV/0!');
        expect(inspection.compareRows(rows,'2026-11',master).invalid_cells).toHaveLength(1);
    });
    it('rejects invalid month and non-Excel content', () => {
        expect(() => inspection.compareRows([], '2026-13', master)).toThrow();
        expect(() => inspection.readExcel(Buffer.from('not an Excel file'))).toThrow();
    });
});
