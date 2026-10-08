import { Injectable } from '@nestjs/common';
import { ExportExcelDto } from '../dto/export-excel.dto';
import { defaultExcel, getBufferFromExcel } from 'src/common/utils/exceljs';
import { ExportExcelResult } from '../interface/excel.interface';
import { formatDate, getFYear, now } from 'src/common/utils/dayjs.utils';

@Injectable()
export class ExportExcelService {
    private readonly templatePath = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/mfgreport/packing-list/vgm-template.xlsx`;

    async exportExcel(dto: ExportExcelDto): Promise<ExportExcelResult> {
        try {
            const workbook = await defaultExcel({
                templatePath: this.templatePath,
                alignment: { body: undefined },
                manual: true,
                autoWidth: false,
                autoHeight: false,
                manualActions: (sheet) => {
                    const monthChar = formatDate(dto.VANNDATE, 'MMM');
                    // เปลี่ยนชื่อ
                    sheet.name = `VGM-${monthChar}`;
                    // sheet.getCell('B3').value = `Update: ${formatDate(dto.VANNDATE, 'DD-MMM-YY')}`;
                    sheet.getCell('A6').value = formatDate(
                        dto.VANNDATE,
                        'DD-MMM-YY',
                    );
                    const dateSubmit = now('DD-MMM');
                    const timeSubmit = now('HH:mm');
                    dto.DATA.forEach((item, index) => {
                        const rowNum = index + 6;
                        sheet.getRow(rowNum).height = 21; // กำหนดความสูงของแถว
                        sheet.getCell(`B${rowNum}`).value = item.LOADNO;
                        sheet.getCell(`C${rowNum}`).value = item.AMECLOAD;
                        sheet.getCell(`D${rowNum}`).value = item.CONTAINSIZE;
                        sheet.getCell(`K${rowNum}`).value = item.ACTUAL_WEIGHT;
                        sheet.getCell(`M${rowNum}`).value = item.PROJECT;
                        sheet.getCell(`N${rowNum}`).value = dateSubmit;
                        sheet.getCell(`O${rowNum}`).value = timeSubmit;

                        // กำหนดเส้นขอบและสีตัวอักษร
                        for(let col = 2; col <= 16; col++) {
                            const cell = sheet.getCell(rowNum, col);
                            cell.border = {
                                left: { style: 'thin' },
                                right: { style: 'thin' },
                                bottom: { style: 'dotted' },
                            };
                        }

                        // ตัวอักษรสีแดง
                        sheet.getCell(`K${rowNum}`).font = {
                            color: { argb: 'FFFF0000' }, // สีแดง
                        };
                        // กำหนดรูปแบบตัวเลขและวันที่
                        sheet.getCell(`K${rowNum}`).numFmt = '_-* #,##0_-;-* #,##0_-;_-* "-"??_-;_-@_-'; // กำหนดรูปแบบตัวเลข
                        sheet.getCell(`N${rowNum}`).numFmt = 'DD-MMM'; // กำหนดรูปแบบตัวเลข
                        sheet.getCell(`O${rowNum}`).numFmt = 'HH:mm'; // กำหนดรูปแบบตัวเลข

                        // กำหนดการจัดแนวของข้อความ
                        sheet.getCell(`B${rowNum}`).alignment = { horizontal: 'center' };
                        sheet.getCell(`C${rowNum}`).alignment = { horizontal: 'center' };
                        sheet.getCell(`D${rowNum}`).alignment = { horizontal: 'center' };
                        sheet.getCell(`N${rowNum}`).alignment = { horizontal: 'center' };
                        sheet.getCell(`O${rowNum}`).alignment = { horizontal: 'center' };
                    });
                },
            });

            // สร้าง Buffer จาก workbook
            const buffer = await getBufferFromExcel(workbook);

            return {
                buffer,
                filename: `VGM (Verified Gross Mass)-FY${getFYear()} [Van date ${formatDate(dto.VANNDATE, 'DD-MMM-YY')}].xlsx`,
            };
        } catch (error) {
            throw new Error(`Failed to export excel: ${error.message}`);
        }
    }
}
