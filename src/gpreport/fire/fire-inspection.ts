import { UnprocessableEntityException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { FireItemMst } from 'src/common/Entities/gpreport/table/FIRE_ITEM_MST.entity';

interface InspectionRow {
    sheet: string;
    row: number;
    date: string;
    cells: Record<string, string>;
}

export class FireInspection {
    normalizeCode(value: string) {
        return String(value).replace(/[\s\p{Z}]+/gu, '');
    }

    private dateMonth(value: string) {
        const text = value.trim();
        let year: number, month: number, day: number;
        let match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
        if (match) {
            [, month, day, year] = match.map(Number);
        } else {
            match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(text);
            if (!match || +match[4] > 23 || +match[5] > 59 || +match[6] > 59) return null;
            [, year, month, day] = match.map(Number);
        }
        const date = new Date(0);
        date.setUTCFullYear(year, month - 1, day);
        if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
        return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
    }

    compareRows(rows: InspectionRow[], month: string, master: FireItemMst[]) {
        if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
            throw new UnprocessableEntityException('กรุณาเลือกเดือนและปีให้ถูกต้อง');
        }
        const found = new Map<string, string>();
        const invalidCells: {sheet: string; row: number; column: string; value: string}[] = [];
        const invalidDates: {sheet: string; row: number; value: string}[] = [];
        let matchedRows = 0;
        for (const row of rows) {
            const dateMonth = this.dateMonth(row.date);
            if (dateMonth === null) {
                invalidDates.push({sheet: row.sheet, row: row.row, value: String(row.date)});
                continue;
            }
            if (dateMonth !== month) continue;
            matchedRows++;
            for (const [column, value] of Object.entries(row.cells)) {
                if (!/^(?:[J-Z]|A[A-Z]|B[A-E])$/.test(column) || value == null || String(value).trim() === '') continue;
                const matches = [...String(value).matchAll(/\(([^()]*)\)/gu)];
                const code = matches.length ? this.normalizeCode(matches[matches.length - 1][1]) : '';
                if (!code) invalidCells.push({sheet: row.sheet, row: row.row, column, value: String(value)});
                else found.set(code, code);
            }
        }
        const expected = new Map(master.map(item => [this.normalizeCode(item.FIRE_CODE), item]));
        const missing = [...expected].filter(([code]) => !found.has(code)).map(([, item]) => item);
        const unexpected = [...found.keys()].filter(code => !expected.has(code));
        return {
            month, master_count: expected.size, matched_rows: matchedRows, found_count: found.size,
            matched_count: [...expected.keys()].filter(code => found.has(code)).length,
            missing, unexpected, invalid_cells: invalidCells, invalid_dates: invalidDates,
            complete: expected.size > 0 && matchedRows > 0 && !missing.length && !unexpected.length && !invalidCells.length && !invalidDates.length,
        };
    }

    readExcel(buffer: Buffer): InspectionRow[] {
        const zip = buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
        const ole = buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
        if (!zip && !ole) throw new UnprocessableEntityException('รองรับเฉพาะไฟล์ Excel .xlsx และ .xls เท่านั้น');
        let book: XLSX.WorkBook;
        try {
            book = XLSX.read(buffer, {type: 'buffer', cellNF: true, cellText: false});
        } catch {
            throw new UnprocessableEntityException('ไม่สามารถอ่านไฟล์ Excel นี้ได้ กรุณาบันทึกไฟล์เป็น .xlsx หรือ .xls ใหม่แล้วลองอีกครั้ง');
        }
        if (book.SheetNames.length > 20) throw new UnprocessableEntityException('ไฟล์ต้องมีไม่เกิน 20 worksheets');
        const rows: InspectionRow[] = [];
        const date1904 = !!book.Workbook?.WBProps?.date1904;
        const cellText = (cell: XLSX.CellObject, date = false) => {
            if (!cell || cell.v == null) return '';
            if (cell.t === 'e') return String(XLSX.utils.format_cell(cell));
            const numericDate = date && /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(String(cell.v).trim());
            if (numericDate || (cell.t === 'n' && cell.z && XLSX.SSF.is_date(cell.z))) {
                const parsed = XLSX.SSF.parse_date_code(Number(cell.v), {date1904});
                if (!parsed) return String(cell.v);
                return `${String(parsed.m).padStart(2, '0')}/${String(parsed.d).padStart(2, '0')}/${String(parsed.y).padStart(4, '0')}`;
            }
            if (cell.t === 'b') return cell.v ? '1' : '';
            return String(cell.v);
        };
        for (const name of book.SheetNames) {
            const sheet = book.Sheets[name];
            if (!sheet['!ref']) continue;
            const range = XLSX.utils.decode_range(sheet['!ref']);
            if (range.e.r >= 50000) throw new UnprocessableEntityException('แต่ละ worksheet ต้องมีไม่เกิน 50,000 แถว');
            for (let row = 1; row <= range.e.r; row++) {
                const date = cellText(sheet[XLSX.utils.encode_cell({r: row, c: 6})], true);
                const cells: Record<string, string> = {};
                for (let column = 9; column <= 56; column++) {
                    const value = cellText(sheet[XLSX.utils.encode_cell({r: row, c: column})]);
                    if (value.trim()) cells[XLSX.utils.encode_col(column)] = value;
                }
                if (date.trim() || Object.keys(cells).length) rows.push({sheet: name, row: row + 1, date, cells});
            }
        }
        return rows;
    }
}
