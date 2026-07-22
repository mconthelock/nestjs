import * as ExcelJS from 'exceljs';
import { toExcelDate } from './dayjs.utils';

export async function defaultExcel({
    data = [],
    column = [],
    sheetName = 'Sheet1',
    font = { bold: true }, // ทำให้ตัวหนา
    alignment = {
        vertical: 'middle' as const,
        horizontal: 'center' as const,
        body: { vertical: 'top' as const, horizontal: 'left' as const, wrapText: true },
    }, // จัดข้อความให้อยู่ตรงกลาง
    extraWidth = 8,
    manual = false,
    manualActions = (sheet: ExcelJS.Worksheet) => {},
    autoWidth = true,
    autoHeight = true,
    startRow = 1,
} = {}) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName); // เพื่มชีท และตั้งชื่อชีท
    const alignments = {
        vertical: alignment?.vertical ?? 'middle',
        horizontal: alignment?.horizontal ?? 'center',
        body: {
            vertical: alignment?.body?.vertical ?? 'top',
            horizontal: alignment?.body?.horizontal ?? 'left',
            wrapText: alignment?.body?.wrapText ?? true,
        },
    };

    // ตั้งชื่อ column และ key เพื่อให้สอดคล้องกับข้อมูล
    sheet.columns = column.map((col) => {
        const formatted = { ...col };
        if (col.type === 'date')
            formatted.style = { numFmt: col.numFmt || 'yyyy-mm-dd' };
        if (col.type === 'number')
            formatted.style = { numFmt: col.numFmt || '0' };
        return formatted;
    });

    const typedRows = data.map((row) => {
        const o = {};
        for (const col of column) {
            let val = row[col.key];
            if (Array.isArray(val)) {
                if (col.bullet) {
                    val = val.map((v) => `• ${v}`).join(col.join || '\n');
                } else {
                    val = val.join(col.join || '\n');
                }
            }
            if (col.type === 'date') {
                o[col.key] = toExcelDate(val, col.numFmt || ''); // 🔥 จุดเดียวจบ
            } else if (col.type === 'number') {
                if (val === '' || val == null) o[col.key] = null;
                else {
                    const n = Number(val);
                    o[col.key] = isNaN(n) ? null : n;
                }
            } else {
                o[col.key] = val ?? null;
            }
        }
        return o;
    });

    // เว้นแถวว่าง
    for (let i = 1; i < startRow; i++) {
        sheet.addRow([]);
    }

    // เพิ่มข้อมูลใน Sheet
    sheet.addRows(typedRows);

    const headerRow = sheet.getRow(1);
    headerRow.font = font;
    headerRow.alignment = alignments;
    // ตรวจสอบว่ามีฟังก์ชัน manualActions หรือไม่
    if (manual) {
        manualActions(sheet); // ส่ง sheet เพื่อให้ปรับแต่งตามที่กำหนด
    }

    if (alignments.body != undefined) {
        sheet.columns.forEach((col) => {
            col.alignment = alignments.body; // ตั้งค่า alignment ให้กับทุกคอลัมน์
        });
    }

    // prettier-ignore
    if (autoWidth) {
        // คำนวณความยาวของข้อมูลในแต่ละคอลัมน์ และปรับความกว้าง
        sheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                if (cell.isMerged && cell.address !== cell.master.address) return;
                const columnLength = cell.value ? String(cell.value).length : 10; // คำนวณความยาวของข้อมูลในเซลล์
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            // จำกัดความกว้างไม่ให้เกินค่าใดค่าหนึ่ง (กันพัง)
            if (maxLength > 40) maxLength = 40;
            
            column.width = maxLength + extraWidth; // เพิ่มความกว้างอีกเล็กน้อยเพื่อไม่ให้ข้อมูลชนขอบ
        });
    }
    if (autoHeight) {
        sheet.eachRow((row) => {
            let maxLines = 1;
            row.eachCell({ includeEmpty: true }, (cell) => {
                const lines = cell.value
                    ? cell.value.toString().split("\n").length
                    : 1;
                if (lines > maxLines) {
                    maxLines = lines;
                }
            });

            row.height = maxLines * 15; // ปรับความสูงของแถวตามจำนวนบรรทัด
        });
    }
    return workbook;
}


export async function saveExcelFile(workbook: ExcelJS.Workbook, filePath: string) {
    await workbook.xlsx.writeFile(filePath);
}

export async function getBufferFromExcel(workbook: ExcelJS.Workbook): Promise<Buffer> {
    const excelBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(excelBuffer);
}