import { UnprocessableEntityException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
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

    async readExcel(buffer: Buffer): Promise<InspectionRow[]> {
        const zip = buffer.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
        if (!zip) throw new UnprocessableEntityException('รองรับเฉพาะไฟล์ Excel .xlsx เท่านั้น');
        const book = new ExcelJS.Workbook();
        try {
            await book.xlsx.load(Uint8Array.from(buffer).buffer);
        } catch {
            throw new UnprocessableEntityException('ไม่สามารถอ่านไฟล์ Excel นี้ได้ กรุณาบันทึกไฟล์เป็น .xlsx ใหม่แล้วลองอีกครั้ง');
        }
        if (book.worksheets.length > 20) throw new UnprocessableEntityException('ไฟล์ต้องมีไม่เกิน 20 worksheets');
        const rows: InspectionRow[] = [];
        const date1904 = !!book.properties.date1904;
        const formatDate = (value: Date) => {
            if (Number.isNaN(value.getTime())) return '';
            return `${String(value.getUTCMonth() + 1).padStart(2, '0')}/${String(value.getUTCDate()).padStart(2, '0')}/${String(value.getUTCFullYear()).padStart(4, '0')}`;
        };
        const cellText = (value: ExcelJS.CellValue, date = false): string => {
            if (value == null) return '';
            if (value instanceof Date) return formatDate(value);
            if (typeof value === 'object') {
                if ('error' in value) return value.error;
                if ('result' in value) return cellText(value.result, date);
                if ('richText' in value) return value.richText.map(part => part.text).join('');
                if ('text' in value) return value.text;
                return '';
            }
            const numericDate = date && /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(String(value).trim());
            if (numericDate) {
                const serial = Number(value);
                const parsed = new Date(Math.round((serial - 25569 + (date1904 ? 1462 : 0)) * 86400000));
                return formatDate(parsed) || String(value);
            }
            if (typeof value === 'boolean') return value ? '1' : '';
            return String(value);
        };
        for (const sheet of book.worksheets) {
            if (sheet.rowCount > 50000) throw new UnprocessableEntityException('แต่ละ worksheet ต้องมีไม่เกิน 50,000 แถว');
            for (let row = 2; row <= sheet.rowCount; row++) {
                const date = cellText(sheet.getCell(row, 7).value, true);
                const cells: Record<string, string> = {};
                for (let column = 10; column <= 57; column++) {
                    const cell = sheet.getCell(row, column);
                    const value = cellText(cell.value);
                    if (value.trim()) cells[cell.address.replace(/\d+$/, '')] = value;
                }
                if (date.trim() || Object.keys(cells).length) rows.push({sheet: sheet.name, row, date, cells});
            }
        }
        return rows;
    }
}
