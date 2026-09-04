import * as ExcelJS from 'exceljs';
import { toExcelDate } from './dayjs.utils';
import { Response } from 'express';

export async function defaultExcel(
    options: {
        data?: any[];
        column?: {
            key: string;
            header?: string;
            type?: 'string' | 'number' | 'date';
            numFmt?: string;
            bullet?: boolean;
            join?: string;
            width?: number;
        }[];
        sheetName?: string;
        font?: { bold: boolean };
        alignment?: {
            vertical?: 'top' | 'middle' | 'bottom';
            horizontal?: 'left' | 'center' | 'right';
            body?: {
                vertical?: 'top' | 'middle' | 'bottom';
                horizontal?: 'left' | 'center' | 'right';
                wrapText?: boolean;
            };
        };
        extraWidth?: number;
        manual?: boolean;
        manualActions?: (sheet: ExcelJS.Worksheet) => void;
        autoWidth?: boolean;
        autoHeight?: boolean;
        startRow?: number;
        templatePath?: string;
    } = {},
) {
    const {
        data = [],
        column = [],
        sheetName = 'Sheet1',
        font = { bold: true }, // ทำให้ตัวหนา
        alignment = {
            vertical: 'middle' as const,
            horizontal: 'center' as const,
            body: {
                vertical: 'top' as const,
                horizontal: 'left' as const,
                wrapText: true,
            },
        }, // จัดข้อความให้อยู่ตรงกลาง
        extraWidth = 8,
        manual = false,
        manualActions = (sheet: ExcelJS.Worksheet) => {},
        autoWidth = true,
        autoHeight = true,
        startRow = 1,
    } = options;

    const workbook = new ExcelJS.Workbook();
    let sheet: ExcelJS.Worksheet;
    // 2026-08-05 เปิดไฟล์ template
    if (options.templatePath) {
        await workbook.xlsx.readFile(options.templatePath);
        sheet = workbook.getWorksheet(sheetName);
    } else {
        sheet = workbook.addWorksheet(sheetName); // เพื่มชีท และตั้งชื่อชีท
    }
    const alignments = {
        vertical: alignment?.vertical ?? 'middle',
        horizontal: alignment?.horizontal ?? 'center',
        body: {
            vertical: alignment?.body?.vertical ?? 'top',
            horizontal: alignment?.body?.horizontal ?? 'left',
            wrapText: alignment?.body?.wrapText ?? true,
        },
        ...alignment,
    };

    // เว้นแถวว่าง
    for (let i = 1; i < startRow; i++) {
        sheet.addRow([]);
    }

    // เพิ่มหัวด้วยตัวเอง แทนการใช้ sheet.columns
    if (column.length > 0 && column.some((col) => col.header)) {
        const headerRow = sheet.addRow(column.map((col) => col.header));
        headerRow.font = font;
        headerRow.alignment = alignments;
    }

    // กำหนด key ให้แต่ละคอลัมน์
    column.forEach((col, index) => {
        const excelCol = sheet.getColumn(index + 1);
        excelCol.key = col.key;
        if (col.type === 'date') {
            excelCol.numFmt = col.numFmt || 'yyyy-mm-dd';
        } else if (col.type === 'number') {
            excelCol.numFmt = col.numFmt || '0';
        }
    });
    // ตั้งชื่อ column และ key เพื่อให้สอดคล้องกับข้อมูล
    // sheet.columns = column.map((col) => {
    //     const formatted = { ...col };
    //     if (col.type === 'date')
    //         formatted.style = { numFmt: col.numFmt || 'yyyy-mm-dd' };
    //     if (col.type === 'number')
    //         formatted.style = { numFmt: col.numFmt || '0' };
    //     return formatted;
    // });

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

    // เพิ่มข้อมูลใน Sheet
    sheet.addRows(typedRows);

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
                    ? cell.value.toString().split('\n').length
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

export async function saveExcelFile(
    workbook: ExcelJS.Workbook,
    filePath: string,
) {
    await workbook.xlsx.writeFile(filePath);
}

export async function getBufferFromExcel(
    workbook: ExcelJS.Workbook,
): Promise<Buffer> {
    const excelBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(excelBuffer);
}

/**
 * @author Sutthipong tangmongkhoncharoen(24008)
 * @since 2026-08-05
 * @description ส่งไฟล์ Excel ให้กับผู้ใช้ผ่าน Response ของ Express ใช้ใน Controller
 * @param res
 * @param buffer
 * @param filename
 * @example
 * sendExcel(res, buffer, 'example.xlsx');
 */
export function sendExcel(
    res: Response,
    buffer: Buffer,
    filename: string,
): void {
    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    );

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    res.send(buffer);
}

/**
 * Read file excel
 * @author Sutthipong tangmongkhoncharoen(24008)
 * @since 2026-08-13
 * @description ฟังก์ชันอ่านไฟล์ Excel และส่งออกเป็น Array ของ Object โดยสามารถกำหนดคอลัมน์ที่ต้องการอ่านได้
 * @example 
 * 1. custom function to read file
 *      readInput({
 *          file: file,
            readCustom: true,
            customSheet: (wb) => {
                const ws = wb.worksheets[0];
                const data = [];
                let indexHeader = [];
                let headerList = ['Order No.', 'PO No.', 'P/O Line', 'PurConfirm'];
                let rowHeader = 0;
                ws.eachRow((row, rowNumber) => {
                    // หาชื่อคอลัมน์เพื่อเอา index
                    headerList.forEach((header) => {
                        const check = row.values.find((v => v && v.toString().trim() === header));
                        if (check) {
                            rowHeader = rowNumber;
                            indexHeader.push(row.values.indexOf(check));
                        }
                    });
                    // หากมีแล้วก็เอาข้อมูลคอลัมน์นั้นมา
                    if(indexHeader.length > 0 && rowNumber != rowHeader) {
                        data[data.length] = {
                            MFGNO: row.values[indexHeader[0]].toString().trim(),
                            PONO: row.values[indexHeader[1]].toString().trim(),
                            LINENO: row.values[indexHeader[2]].toString().trim(),
                            CONFIRMDATE: formatDate(row.values[indexHeader[3]].toString().trim())
                        }
                    }
                });
                return data;
            }
        });
    2. read file by header name
        การส่ง headerName เป็น array ของ object ที่มี key, header และ column โดย key คือชื่อคีย์ที่ต้องการใช้ใน object, header คือชื่อหัวข้อใน Excel และ column คือคอลัมน์ที่ต้องการอ่านข้อมูล
        โดยสามารถส่งได้ 3 วิธีคือ
        1. ส่งเป็น array ของ string โดยชื่อที่ส่งมาจะใช้เป้น key ของ object ผลลัพท์ซึ่งจะทำการอ่านข้อมูลตาม index ของ array ที่ส่งมา 
        *** ต้องส่งมาให้ครบทุกคอลัมน์ที่ต้องการอ่านข้อมูลตามจำนวน startCol ถึง endCol ด้วย เช่น A ถึง M  ต้องส่งมาทั้งสิ้น 13 ตัว ไม่งั้นข้อมูลจะไม่ตรง ***
        headerName: [
            'NO',
            'PLANNER',
            'BULK_CODE',
            'DRAWING',
            'PARTNAME',
            'VENDOR',
            'VENDOR_NAME',
            'TRADING',
            'PROCESSING',
            'MANUFACTURER',
            'COUNTRY_OF_ORIGIN',
            'MFG_NAME',
            'MFG_ADDRESS',
        ],
        2. ส่งเป็น array ของ object โดยมี key และ header โดย key คือชื่อคีย์ที่ต้องการใช้ใน object ผลลัพท์ และ header คือชื่อหัวข้อใน Excel ซึ่งจะทำการอ่านข้อมูลตามชื่อหัวข้อที่ส่งมา 
        *** ต้องส่ง headerRow ด้วย ***
        headerName: [
            { key: 'BULK_CODE', header: 'BULK Code'},
            { key: 'TRADING', header: 'Trading'},
            { key: 'PROCESSING', header: 'Processing'},
            { key: 'MANUFACTURER', header: 'Manufacturer'},
            { key: 'COUNTRY_OF_ORIGIN', header: 'Country of Origin'},
            { key: 'MFG_NAME', header: 'Manufacturer Name'},
            { key: 'MFG_ADDRESS', header: 'Manufacturer Address'},
        ],
        3. ส่งเป็น array ของ object โดยมี key และ column โดย key คือชื่อคีย์ที่ต้องการใช้ใน object ผลลัพท์ และ column คือคอลัมน์ที่ต้องการอ่านข้อมูล ซึ่งจะทำการอ่านข้อมูลตามคอลัมน์ที่ส่งมา
        headerName: [
            { key: 'BULK_CODE', header: 'BULK Code', column: 'C' },
            { key: 'TRADING', header: 'Trading', column: 'H' },
            { key: 'PROCESSING', header: 'Processing', column: 'I' },
            { key: 'MANUFACTURER', header: 'Manufacturer', column: 'J' },
            { key: 'COUNTRY_OF_ORIGIN', header: 'Country of Origin', column: 'K' },
            { key: 'MFG_NAME', header: 'Manufacturer Name', column: 'L' },
            { key: 'MFG_ADDRESS', header: 'Manufacturer Address', column: 'M' },
        ],
        @example
        readInput({
            path: 'src/workload/country_origin/files/master.xlsx',
            headerName: [
                { key: 'BULK_CODE', header: 'BULK Code', column: 'C' },
                { key: 'TRADING', header: 'Trading', column: 'H' },
                { key: 'PROCESSING', header: 'Processing', column: 'I' },
                { key: 'MANUFACTURER', header: 'Manufacturer', column: 'J' },
                { key: 'COUNTRY_OF_ORIGIN', header: 'Country of Origin', column: 'K' },
                { key: 'MFG_NAME', header: 'Manufacturer Name', column: 'L' },
                { key: 'MFG_ADDRESS', header: 'Manufacturer Address', column: 'M' },
            ],
            headerRow: 3,
            startRow: 4,
            endRow: 4260,
            startCol: colToNumber('A'),
            endCol: colToNumber('M'),
        });
    3. read file all data in sheet
        ไม่ต้องส่ง headerName และ headerRow จะทำการอ่านข้อมูลทั้งหมดในชีทตาม startRow, endRow, startCol, endCol ที่ส่งมา
 */
export async function readFile({
    path = '',
    file = null,
    startRow = 1,
    endRow = 500,
    startCol = 1, // A
    endCol = 1, // A
    sheetName = 1, // string
    headerRow = null,
    headerName = [],
    skipRow = 0,
    customSheet = null,
}: {
    path?: string;
    file?: ArrayBuffer | null;
    startRow?: number;
    endRow?: number;
    startCol?: number;
    endCol?: number;
    sheetName?: number | string;
    headerRow?: number;
    headerName?: string[] | { key: string; header?: string; column?: string }[];
    skipRow?: number;
    readCustom?: boolean;
    customSheet?: (workbook: ExcelJS.Workbook) => any;
} = {}): Promise<any[]> {
    var data: any[] = [];
    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
    if (!file && !path) throw new Error('Please provide file or path');
    if (path) {
        await workbook.xlsx.readFile(path);
    }
    if (file) {
        await workbook.xlsx.load(file);
    }

    if (customSheet && typeof customSheet === 'function') {
        // read file custom option
        console.log('read custom');

        data = customSheet(workbook);
    } else if (headerName.length > 0) {
        // read file by header name
        console.log('read header');

        const worksheet: ExcelJS.Worksheet =
            sheetName == 1
                ? workbook.worksheets[0]
                : workbook.getWorksheet(sheetName);
        const headerRowData = worksheet.getRow(headerRow);
        let headerType = 'string';
        if (headerName.length > 0 && typeof headerName[0] === 'string') {
            headerName = ['', ...headerName] as string[];
        } else {
            headerType = 'object';
        }
        let rowIndex: number = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber < startRow) return;
            if (rowNumber > endRow) return;
            // console.log('rowNumber', rowNumber, row.values);
            if (headerType === 'string') {
                for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
                    if (!headerName[colIndex]) continue;
                    const headerItem: string = headerName[colIndex] as string;
                    if (!data[rowIndex]) {
                        data[rowIndex] = {};
                    }
                    data[rowIndex][headerItem] = row.values[colIndex] || null;
                }
            } else {
                for (const headerItem of headerName as {
                    key: string;
                    header: string;
                    column: string;
                }[]) {
                    let colIndex: number;
                    if (!headerItem.column && !headerItem.header) {
                        throw new Error(
                            'Please provide column or header in headerName when using object type',
                        );
                    }
                    if (headerItem.column) {
                        colIndex = colToNumber(headerItem.column);
                    } else {
                        if (!headerRow)
                            throw new Error(
                                'Please provide headerRow when using headerName',
                            );
                        const values =
                            headerRowData.values as ExcelJS.CellValue[];
                        colIndex = values.findIndex(
                            (v) => v === headerItem.header,
                        );
                    }
                    if (!data[rowIndex]) {
                        data[rowIndex] = {};
                    }
                    data[rowIndex][headerItem.key] =
                        row.values[colIndex] || null;
                }
            }
            rowIndex++;
        });
    } else {
        // read file all data in sheet
        console.log('read default');

        const worksheet: ExcelJS.Worksheet =
            sheetName == 1
                ? workbook.worksheets[0]
                : workbook.getWorksheet(sheetName);
        let rowIndex: number = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber < startRow) return;
            if (rowNumber > endRow) return;
            if (skipRow > 0 && rowNumber <= skipRow) return;
            if (!data[rowIndex]) data[rowIndex] = {};

            if (endCol == 1) {
                row.eachCell(function (cell, colNumber) {
                    data[rowIndex][colNumber - 1] = cell.value;
                });
            } else {
                let index = 0;
                for (
                    let colIndex = startCol;
                    colIndex <= endCol;
                    colIndex++, index++
                ) {
                    data[rowIndex][index] = row.values[colIndex] || '';
                }
            }
            rowIndex++;
        });
    }
    return data;
}

/**
 * ฟังก์ชันแปลงตัวอักษรคอลัมน์เป็นตัวเลขคอลัมน์
 * @param {string} col
 * @returns {number}
 * @example
 * colToNumber('A') // 1
 * colToNumber('AB') // 28
 * colToNumber('ZZ') // 702
 */
export function colToNumber(col: string): number {
    let number = 0;
    for (let i = 0; i < col.length; i++) {
        number = number * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return number;
}
