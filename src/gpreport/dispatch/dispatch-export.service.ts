import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as ExcelJS from 'exceljs';
import { ExportAndSendMailDto } from './dto/export-and-sendmail.dto';
import { mkdir, writeFile } from 'fs/promises';

@Injectable()
export class DispatchExportService {
  async createShareFolder() {
    try {
      //const basePath = '\\\\amecnas\\FileServer\\Public\\golf\\TEST';
      const basePath = '\\\\amecnas\\FileServer\\GP_Div\\Electronic_Data\\Xerox_in\\0.2 GA\\Bus_report';

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = String(now.getMonth() + 1).padStart(2, '0');

      const yearPath = path.join(basePath, year);
      const monthPath = path.join(yearPath, month);
      await mkdir(yearPath, { recursive: true });
      await mkdir(monthPath, { recursive: true });

      const testFile = path.join(monthPath, 'test.txt');
      await writeFile(testFile, `test at ${new Date().toISOString()}`);

      return {
        status: true,
        message: 'Create folder success',
        folderPath: monthPath,
        base_path: basePath,
        year_path: yearPath,
        month_path: monthPath,
        test_file: testFile,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err?.message || 'Create folder failed',
        folderPath: undefined,
      };
    }
  }

  border() {
    return {
      top: { style: 'thin' as const },
      left: { style: 'thin' as const },
      bottom: { style: 'thin' as const },
      right: { style: 'thin' as const },
    };
  }

  alignment(horizontal: 'left' | 'center' | 'right', vertical: 'top' | 'middle' | 'bottom') {
    return {
      horizontal,
      vertical,
      wrapText: true,
    } as Partial<ExcelJS.Alignment>;
  }

  mergeCell(
    sheet: ExcelJS.Worksheet,
    rowStart: number,
    colStart: number,
    rowEnd: number,
    colEnd: number,
  ) {
    sheet.mergeCells(rowStart, colStart, rowEnd, colEnd);
  }

  applyStyleToRange(
    sheet: ExcelJS.Worksheet,
    colStart: number,
    colEnd: number,
    row: number,
    style: {
      font?: Partial<ExcelJS.Font>;
      alignment?: Partial<ExcelJS.Alignment>;
      border?: Partial<ExcelJS.Borders>;
      fill?: ExcelJS.Fill;
    } = {},
  ) {
    for (let c = colStart; c <= colEnd; c++) {
      const cell = sheet.getRow(row).getCell(c);
      if (style.font) cell.font = style.font;
      if (style.alignment) cell.alignment = style.alignment;
      if (style.border) cell.border = style.border;
      if (style.fill) cell.fill = style.fill;
    }
  }

  async buildBusDailyLayoutWorkbook(reportRes: any) {
    const lines = Array.isArray(reportRes.lines) ? reportRes.lines : [];
    if (!lines.length) {
      throw new Error('ไม่พบข้อมูลรายชื่อผู้ที่จัดรถ');
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Bus Daily Layout');

    const BLOCKS_PER_ROW = 5;
    const BLOCK_WIDTH = 4;
    const BLOCK_GAP = 0;
    const TOTAL_BLOCK_WIDTH = BLOCK_WIDTH + BLOCK_GAP;

    const validLines = lines.filter((line) => {
      const busId = String(line.busid || '').trim();
      if (busId === '30') return false;

      const stops = Array.isArray(line.stops) ? line.stops : [];
      return stops.some((stop) => Array.isArray(stop.passengers) && stop.passengers.length > 0);
    });

    if (!validLines.length) {
      throw new Error('ไม่พบข้อมูลรายชื่อผู้ที่จัดรถ');
    }

    const getBlockStartCol = (blockIndex: number) => 1 + blockIndex * TOTAL_BLOCK_WIDTH;

    const setCell = (row: number, col: number, value: any) => {
      sheet.getRow(row).getCell(col).value = value;
    };

    const styleCell = (
      row: number,
      col: number,
      opts: {
        font?: Partial<ExcelJS.Font>;
        alignment?: Partial<ExcelJS.Alignment>;
        border?: Partial<ExcelJS.Borders>;
        fill?: ExcelJS.Fill;
      } = {},
    ) => {
      const cell = sheet.getRow(row).getCell(col);
      if (opts.font) cell.font = opts.font;
      if (opts.alignment) cell.alignment = opts.alignment;
      if (opts.border) cell.border = opts.border;
      if (opts.fill) cell.fill = opts.fill;
    };

    const applyBorderRange = (rowStart: number, rowEnd: number, colStart: number, colEnd: number) => {
      for (let r = rowStart; r <= rowEnd; r++) {
        for (let c = colStart; c <= colEnd; c++) {
          styleCell(r, c, { border: this.border() });
        }
      }
    };

    const mergeAndSet = (
      row: number,
      colStart: number,
      colEnd: number,
      value: any,
      style: {
        font?: Partial<ExcelJS.Font>;
        alignment?: Partial<ExcelJS.Alignment>;
        border?: Partial<ExcelJS.Borders>;
        fill?: ExcelJS.Fill;
      } = {},
    ) => {
      this.mergeCell(sheet, row, colStart, row, colEnd);
      setCell(row, colStart, value);
      for (let c = colStart; c <= colEnd; c++) {
        styleCell(row, c, style);
      }
    };

    const getLineBlockRows = (line: any) => {
      const stops = Array.isArray(line.stops) ? line.stops : [];
      let count = 3;

      stops.forEach((stop) => {
        const passengers = Array.isArray(stop.passengers) ? stop.passengers : [];
        if (!passengers.length) return;
        count += passengers.length;
      });

      return count;
    };

    const writeLineBlock = (startRow: number, startCol: number, line: any) => {
      const col1 = startCol;
      const col2 = startCol + 1;
      const col3 = startCol + 2;
      const col4 = startCol + 3;

      const stops = Array.isArray(line.stops) ? line.stops : [];
      let currentRow = startRow;
      let runningNo = 1;

      const busTypeText =
        String(line.bustype) === '1' ? 'Bus' :
        String(line.bustype) === '2' ? 'Van' : '';

      const lineName = `${line.busname || line.busid || '-'}${busTypeText ? ` (${busTypeText})` : ''}`;

      mergeAndSet(currentRow, col1, col4, lineName, {
        font: { bold: true, size: 11 },
        alignment: this.alignment('center', 'middle'),
        border: this.border(),
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF2CC' },
        },
      });
      sheet.getRow(currentRow).height = 20;
      currentRow++;

      setCell(currentRow, col1, 'จุดลงรถ');
      setCell(currentRow, col2, 'No.');
      setCell(currentRow, col3, 'รายชื่อ');
      setCell(currentRow, col4, 'แผนก');

      for (let c = col1; c <= col4; c++) {
        styleCell(currentRow, c, {
          font: { bold: true, size: 10 },
          alignment: this.alignment('center', 'middle'),
          border: this.border(),
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8F8F8' },
          },
        });
      }

      sheet.getRow(currentRow).height = 18;
      currentRow++;

      stops.forEach((stop) => {
        const passengers = Array.isArray(stop.passengers) ? stop.passengers : [];
        if (!passengers.length) return;

        const stopStartRow = currentRow;
        const stopEndRow = currentRow + passengers.length - 1;

        if (passengers.length > 1) {
          this.mergeCell(sheet, stopStartRow, col1, stopEndRow, col1);
        }

        setCell(stopStartRow, col1, stop.stop_name || '-');
        styleCell(stopStartRow, col1, {
          font: { size: 10 },
          alignment: {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          },
          border: this.border(),
        });

        if (passengers.length > 1) {
          for (let r = stopStartRow; r <= stopEndRow; r++) {
            styleCell(r, col1, {
              border: this.border(),
              alignment: {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true,
              },
            });
          }
        }

        passengers.forEach((p, index) => {
          const rowNo = currentRow + index;
          setCell(rowNo, col2, runningNo++);
          setCell(rowNo, col3, p.fullname || '-');

          const sec = String(p.sec || '').trim().toUpperCase();
          const dept = String(p.dept || '').trim();
          let department = dept;
          if (sec && sec !== 'NO SECTION') {
            department = sec;
          }

          setCell(rowNo, col4, department || '-');

          styleCell(rowNo, col2, {
            font: { size: 10 },
            alignment: this.alignment('center', 'middle'),
            border: this.border(),
          });

          styleCell(rowNo, col3, {
            font: { size: 10 },
            alignment: {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: true,
              indent: 1,
            },
            border: this.border(),
          });

          styleCell(rowNo, col4, {
            font: { size: 10 },
            alignment: this.alignment('center', 'middle'),
            border: this.border(),
          });

          sheet.getRow(rowNo).height = 18;
        });

        currentRow = stopEndRow + 1;
      });

      const endRow = currentRow - 1;
      applyBorderRange(startRow, endRow, col1, col4);

      return endRow;
    };

    const totalCols = BLOCKS_PER_ROW * TOTAL_BLOCK_WIDTH - BLOCK_GAP;
    this.mergeCell(sheet, 1, 1, 1, totalCols);
    setCell(1, 1, reportRes.title || 'ตารางรถรับส่งพนักงาน');

    this.applyStyleToRange(sheet, 1, totalCols, 1, {
      font: { bold: true, size: 14 },
      alignment: this.alignment('center', 'middle'),
    });

    sheet.getRow(1).height = 24;

    let rowCursor = 3;
    for (let i = 0; i < validLines.length; i += BLOCKS_PER_ROW) {
      const rowLines = validLines.slice(i, i + BLOCKS_PER_ROW);
      let maxBlockHeight = 0;

      rowLines.forEach((line) => {
        const h = getLineBlockRows(line);
        if (h > maxBlockHeight) maxBlockHeight = h;
      });

      rowLines.forEach((line, idx) => {
        const startCol = getBlockStartCol(idx);
        writeLineBlock(rowCursor, startCol, line);
      });

      rowCursor += maxBlockHeight + 2;
    }

    for (let i = 0; i < BLOCKS_PER_ROW; i++) {
      const startCol = getBlockStartCol(i);
      sheet.getColumn(startCol).width = 16;
      sheet.getColumn(startCol + 1).width = 6;
      sheet.getColumn(startCol + 2).width = 22;
      sheet.getColumn(startCol + 3).width = 12;
    }

    sheet.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.2,
        right: 0.2,
        top: 0.3,
        bottom: 0.3,
        header: 0.1,
        footer: 0.1,
      },
    };

    return workbook;
  }

  async buildDisabledPassengerWorkbook(reportRes: any, dto: ExportAndSendMailDto) {
    const rows = Array.isArray(reportRes.rows) ? reportRes.rows : [];
    const displayDateText =
      reportRes?.display_date_text ||
      dto?.display_date_text ||
      '-';
    const displayTimeText =
      reportRes?.display_time_text ||
      dto?.display_time_text ||
      '';

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Disabled Passenger');

    sheet.insertRow(1, ['รายชื่อผู้ที่ไม่สามารถจัดรถรับส่งได้']);
    sheet.insertRow(2, [`ประจำวันที่ : ${displayDateText}`]);
    sheet.insertRow(3, [`เวลา : ${displayTimeText}`]);
    sheet.insertRow(4, []);

    this.mergeCell(sheet, 1, 1, 1, 7);
    this.mergeCell(sheet, 2, 1, 2, 7);
    this.mergeCell(sheet, 3, 1, 3, 7);

    this.applyStyleToRange(sheet, 1, 7, 1, {
      font: { bold: true, size: 16 },
      alignment: this.alignment('center', 'middle'),
    });

    this.applyStyleToRange(sheet, 1, 7, 2, {
      font: { bold: true, size: 14 },
      alignment: this.alignment('center', 'middle'),
    });

    this.applyStyleToRange(sheet, 1, 7, 3, {
      font: { bold: true, size: 14 },
      alignment: this.alignment('center', 'middle'),
    });

    // 🔥 ลบคอลัม "เวลากลับ"
    sheet.getRow(5).values = [
      'No',
      'รหัส',
      'ชื่อ-นามสกุล',
      'SEC',
      'DEPT',
      'DIV',
      'จุดรถ',
    ];

    this.applyStyleToRange(sheet, 1, 7, 5, {
      font: { bold: true, size: 13 },
      alignment: this.alignment('center', 'middle'),
      border: this.border(),
    });

    rows.forEach((row, i) => {
      const rowNumber = i + 6;
      sheet.getRow(rowNumber).values = [
        row.no ?? i + 1,
        row.empno || '',
        row.fullname || '',
        row.sec || '',
        row.dept || '',
        row.div || '',
        row.stop_name || '',
      ];
    });

    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 12;
    sheet.getColumn(3).width = 30;
    sheet.getColumn(4).width = 16;
    sheet.getColumn(5).width = 18;
    sheet.getColumn(6).width = 18;
    sheet.getColumn(7).width = 24;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 5) {
        row.eachCell((cell, colNumber) => {
          cell.font = { ...(cell.font || {}), size: 12 };
          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          };

          if (colNumber === 3 && rowNumber >= 6) {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: true,
              indent: 1,
            };
          }

          cell.border = this.border();
        });
      }
    });

    return workbook;
  }


}