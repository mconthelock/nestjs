import * as ExcelJS from 'exceljs';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as dayjsModule from 'dayjs';
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);

interface excelExportOptions {
    templatePath: string;
    filename: string;
    rowstart?: number;
    data: any[];
    staticText?: { cols: string; text: string }[];
    execute?: (
        workbook: ExcelJS.Workbook,
        sheet: ExcelJS.Worksheet,
    ) => Promise<void>;
    saveas?: string;
}

type ExportColumnFormat = {
    excelColumn: number;
    type: string;
    key: string;
    option?: string;
};

export class MapOptions implements excelExportOptions {
    templatePath = '';
    filename = 'export.xlsx';
    rowstart = 2;
    data: any[] = [];
    staticText?: { cols: string; text: string }[] = [];
    execute?: (
        workbook: ExcelJS.Workbook,
        sheet: ExcelJS.Worksheet,
    ) => Promise<void>;
    saveas?: string;

    // Constructor can be used to override defaults
    constructor(options?: Partial<excelExportOptions>) {
        Object.assign(this, options);
    }
}

export const cloneRows = async (worksheet, sourceRowNum, targetRowNum) => {
    const sourceRow = worksheet.getRow(sourceRowNum);
    const newRow = worksheet.insertRow(targetRowNum);
    sourceRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const newCell = newRow.getCell(colNumber);
        if (cell.style) {
            newCell.style = { ...cell.style };
        }
    });
    newRow.height = sourceRow.height;
};

const EXPORT_FORMAT_TYPES = new Set([
    'text',
    'date',
    'datetime',
    'account',
    'formula',
    'func',
]);

const normalizeCellValue = (value: ExcelJS.CellValue): string => {
    if (value == null) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value).trim();
    }
    if (value instanceof Date)
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    if (typeof value === 'object') {
        if ('text' in value && typeof value.text === 'string') {
            return value.text.trim();
        }
        if ('richText' in value && Array.isArray(value.richText)) {
            return value.richText
                .map((item) => item.text || '')
                .join('')
                .trim();
        }
        if ('result' in value && value.result != null) {
            return String(value.result).trim();
        }
    }
    return String(value).trim();
};

const resolveValueByPath = (source: any, rawPath: string) => {
    if (!rawPath) return '';

    const parts = rawPath
        .split('.')
        .map((item) => item.trim())
        .filter(Boolean);

    let current = source;
    for (const part of parts) {
        if (current == null) return '';

        if (Array.isArray(current)) {
            current = current[0];
        }

        if (current == null || typeof current !== 'object') return '';

        const exactKey = Object.prototype.hasOwnProperty.call(current, part)
            ? part
            : undefined;
        const normalizedKey =
            exactKey ||
            Object.keys(current).find(
                (key) => key.trim().toLowerCase() === part.toLowerCase(),
            );

        if (!normalizedKey) return '';
        current = current[normalizedKey];
    }

    if (Array.isArray(current)) {
        return current[0] ?? '';
    }

    return current ?? '';
};

const getWorksheetRoles = (workbook: ExcelJS.Workbook) => {
    const worksheets = workbook.worksheets;
    const mappingSheet = worksheets.find((worksheet) => {
        let matchedRows = 0;
        worksheet.eachRow({ includeEmpty: false }, (row) => {
            const excelColumn = normalizeCellValue(row.getCell(2).value);
            const formatType = normalizeCellValue(
                row.getCell(3).value,
            ).toLowerCase();
            const dataKey = normalizeCellValue(row.getCell(4).value);

            if (
                excelColumn &&
                !Number.isNaN(Number(excelColumn)) &&
                EXPORT_FORMAT_TYPES.has(formatType) &&
                dataKey
            ) {
                matchedRows++;
            }
        });
        return matchedRows > 0;
    });

    const dataSheet = worksheets.find(
        (worksheet) => worksheet !== mappingSheet,
    );

    return {
        dataSheet,
        mappingSheet,
    };
};

export const exportExcel = async (
    option: excelExportOptions = {} as excelExportOptions,
) => {
    try {
        const opt = new MapOptions(option);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(opt.templatePath);
        const { dataSheet: sheet, mappingSheet: sheet_data } =
            getWorksheetRoles(workbook);

        if (!sheet || !sheet_data) {
            throw new Error(
                'Invalid Excel template: expected at least 2 worksheets.',
            );
        }

        const columns = await exportFormat(sheet_data);
        const colCount = sheet.columnCount;

        let color = opt.rowstart;
        let target = opt.rowstart + 2;

        for (const el of opt.data) {
            await cloneRows(sheet, color, target);
            for (let j = 1; j <= colCount; j++) {
                const format = columns.find((item) => item.excelColumn === j);
                if (!format || !format.key) continue;

                const formatType = format.type.toLowerCase();
                const formatKey = format.key;
                const formatOption = format.option?.trim() || '';

                let value: any = '';
                if (formatType == 'func') {
                    const param = formatOption ? JSON.parse(formatOption) : {};
                    value = eval(formatKey)(el, param);
                    sheet.getCell(target, format.excelColumn).value = value;
                } else if (formatType == 'formula') {
                    value = {
                        formula: formatKey.replaceAll(
                            '{x}',
                            String(target - 2),
                        ),
                    };
                    sheet.getCell(target, format.excelColumn).value = value;
                } else {
                    value = resolveValueByPath(el, formatKey);
                    //Format Data
                    if (formatType === 'date' && value) {
                        // prettier-ignore
                        sheet.getCell(target, format.excelColumn).value = dayjs(value).add(7, 'hour').toDate();
                        sheet.getCell(target, format.excelColumn).numFmt =
                            formatOption ? formatOption : 'yyyy-mm-dd';
                    } else if (formatType === 'datetime' && value) {
                        // prettier-ignore
                        sheet.getCell(target, format.excelColumn).value = dayjs(value).add(7, 'hour').toDate();
                        sheet.getCell(target, format.excelColumn).numFmt =
                            formatOption ? formatOption : 'yyyy-mm-dd hh:mm:ss';
                    } else if (formatType === 'account') {
                        const digit = formatOption ? parseInt(formatOption) : 0;
                        // prettier-ignore
                        sheet.getCell(target, format.excelColumn).value = value !== "" ? parseFloat(value) : 0;
                        sheet.getCell(target, format.excelColumn).numFmt =
                            `_(* #,##0${digit > 0 ? '.' + '0'.repeat(digit) : ''}_);_(* (#,##0${digit > 0 ? '.' + '0'.repeat(digit) : ''})_);_(* "-"??_);_(@_)`;
                    } else {
                        sheet.getCell(target, format.excelColumn).value = value;
                        sheet.getCell(target, format.excelColumn).numFmt =
                            'General';
                    }
                }
            }
            target = target + 1;
            color = color == opt.rowstart ? color + 1 : opt.rowstart;
        }
        if (opt.staticText) {
            for (let rw of opt.staticText) {
                sheet.getCell(rw.cols).value = rw.text;
            }
        }

        // Excute more options (if any)
        if (opt.execute != null && typeof opt.execute == 'function') {
            await opt.execute(workbook, sheet);
        }

        sheet.spliceRows(opt.rowstart, 2);
        // Remove all sheets except the first one
        while (workbook.worksheets.length > 1)
            workbook.removeWorksheet(workbook.worksheets[1].id);

        const buffer = await workbook.xlsx.writeBuffer();
        const outputBuffer = Buffer.isBuffer(buffer)
            ? buffer
            : Buffer.from(buffer as ArrayBuffer);

        if (opt.saveas && typeof opt.saveas === 'string') {
            const saveAs = opt.saveas.trim();
            if (saveAs) {
                const isDirectory = !path.extname(saveAs);
                const outputPath = isDirectory
                    ? path.join(saveAs, opt.filename)
                    : saveAs;
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                await fs.writeFile(outputPath, outputBuffer);
            }
        }

        return outputBuffer;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const exportFormat = (sheet) => {
    const data_array: ExportColumnFormat[] = [];
    sheet.eachRow({ includeEmpty: false }, function (row) {
        const excelColumn = Number(normalizeCellValue(row.getCell(2).value));
        const type = normalizeCellValue(row.getCell(3).value);
        const key = normalizeCellValue(row.getCell(1).value);
        const option = normalizeCellValue(row.getCell(5).value);

        if (!excelColumn || !type || !key) {
            return;
        }

        data_array.push({
            excelColumn,
            type,
            key,
            option,
        });
    });
    return data_array;
};
