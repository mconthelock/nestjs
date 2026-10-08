import { Injectable } from '@nestjs/common';
import { setListForHtml } from '../builders/list.builder';
import { GenerateExcelParam, GenerateExcelResult } from '../interface/excel.interface';
import { CreateDataForHTMLResult } from '../interface/list-builder.interface';
import {
    defaultExcel,
    getBufferFromExcel,
    saveExcelFile,
} from 'src/common/utils/exceljs';
import { joinPaths, makeDirIfNotExists } from 'src/common/utils/files.utils';

@Injectable()
export class ExcelService {
    async generateExcelFile({
        list,
        shippingMark,
        path,
        fileName,
        order,
        subject,
        project,
    }: GenerateExcelParam): Promise<GenerateExcelResult> {
        const listForHtml: CreateDataForHTMLResult = setListForHtml(
            list,
            'excel',
        );
        const data = listForHtml.data.flatMap((item) => item.DETAILS);
        let mark: string[] = [];
        if (shippingMark.includes('|')) {
            mark = shippingMark.split('|');
        }
        const startRow = mark.length > 0 ? mark.length + 1 : 5;
        const workbook = await defaultExcel({
            data: data,
            column: [
                { key: 'SEQ', header: 'SEQ' },
                { key: 'CASE', header: 'CASE' },
                { key: 'VITEM', header: 'PACKNO' },
                { key: 'VPART', header: 'DESCRIPTION' },
                { key: 'VDRAWING', header: 'DRAWING NO.' },
                { key: 'NQTY', header: 'QTY' },
                { key: 'NET', header: 'NET' },
                { key: 'GROSS', header: 'GRS' },
                { key: 'DIMENSION', header: 'DIMENSION(CM)' },
                { key: 'VOLUME', header: 'VOLUME' },
            ],
            font: { bold: false },
            alignment: { body: undefined },
            extraWidth: 2,
            startRow: startRow,
            manual: true,
            manualActions: (sheet) => {
                sheet.getCell('B1').value = 'ORDER:';
                sheet.getCell('B2').value = 'SUBJECT:';
                sheet.getCell('B3').value = 'PROJECT:';

                sheet.getCell('D1').value = order.toUpperCase();
                sheet.getCell('D2').value = subject.toUpperCase();
                sheet.getCell('D3').value = project.toUpperCase();

                sheet.getCell('I1').value = 'TOTAL GROSSWEIGHT';
                sheet.getCell('I2').value = 'TOTAL NETWEIGHT';
                sheet.getCell('I3').value = 'TOTAL CUBIC-METER  ';

                sheet.getCell('J1').value = listForHtml.totalGross;
                sheet.getCell('J2').value = listForHtml.totalNet;
                sheet.getCell('J3').value = listForHtml.totalDimention;

                for (let i = 0; i < mark.length; i++) {
                    sheet.getCell(`K${i + 1}`).value = mark[i];
                    sheet.mergeCells(`K${i + 1}:M${i + 1}`);
                    sheet.getCell(`K${i + 1}`).alignment = {
                        vertical: 'middle', // 'top' | 'middle' | 'bottom'
                        horizontal: 'center', // 'left' | 'center' | 'right'
                    };
                }
            },
        });

        // สร้าง Buffer จาก workbook
        const buffer = await getBufferFromExcel(workbook);

        // กำหนด path ที่ต้องการบันทึก
        const fileNameWithoutExt = fileName.replace(/\.(pdf|PDF)$/i, '');
        const fileNameWithExt = `${fileNameWithoutExt}.xlsx`;
        const filePath = await joinPaths(path, fileNameWithExt);

        await makeDirIfNotExists(path); // ตรวจสอบและสร้างโฟลเดอร์ถ้าไม่อยู่

        // บันทึกไฟล์ลง path
        await saveExcelFile(workbook, filePath);

        return {
            data: buffer,
            fileName: fileNameWithExt,
            filePath: path,
        };
    }
}
