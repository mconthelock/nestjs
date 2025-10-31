import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PDFDocument } from 'pdf-lib';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dayjs from 'dayjs';
import 'dayjs/locale/th';
import { digitsNumber, intVal } from '../../common/helpers/baht-text.helper';
import {
  drawGrid,
  writeLineBox,
  protectedFile,
} from '../../common/helpers/file-pdf.helper';
import { cloneRows } from 'src/common/helpers/file-excel.helper';
import { DatabaseService } from '../shared/database.service';
const fontkit = require('@pdf-lib/fontkit');
import * as oracledb from 'oracledb';

@Injectable()
export class PromoteService {
  protected pdfdoc: PDFDocument;
  protected pdfpage: any;
  protected fontstyle: any;
  protected fontsize: number;
  protected output_path: string;

  constructor(private dbService: DatabaseService) {}

  async findAll(credentials: any, body: any) {
    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(credentials);
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;
      const result = await conn.execute(
        `DECLARE v_cursor SYS_REFCURSOR;
          BEGIN
              PROMOTE(:KEYVALUE, :EFFDATE, :EMTYPE, v_cursor);
              :result := v_cursor;
          END;`,
        {
          KEYVALUE: connection.passcode,
          EFFDATE: body.period,
          EMTYPE: body.type,
          result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const resultSet = result.outBinds.result;
      const rows = await resultSet.getRows();
      await resultSet.close();
      return rows;
    } catch (error) {
      if (error.message.includes('ORA-01017')) {
        throw new UnauthorizedException(
          'Invalid credentials for sensitive data access.',
        );
      }
      console.error('Error fetching Promotion data:', error);
      throw new InternalServerErrorException('Failed to fetch Promotion data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }

  async findById(credentials: any, body: any) {
    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(credentials);
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;
      const result = await conn.execute(
        `DECLARE v_cursor SYS_REFCURSOR;
          BEGIN
              PROMOTEEMPLOYEE(:KEYVALUE, :EFFDATE, :EMPNO, v_cursor);
              :result := v_cursor;
          END;`,
        {
          KEYVALUE: connection.passcode,
          EFFDATE: body.period,
          EMPNO: body.empno,
          result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT },
      );
      const resultSet = result.outBinds.result;
      const rows = await resultSet.getRow();
      await resultSet.close();
      return rows;
    } catch (error) {
      console.error('Error fetching Twi 50 data:', error);
      throw new InternalServerErrorException('Failed to fetch Promote data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }

  async createFile(data: any) {
    const libs = [
      { id: 'MP', path: 'Non-Manager' },
      { id: 'MG', path: 'Manager' },
      { id: 'JP', path: 'Japanese' },
    ];
    try {
      const templatePath = path.join(
        `${process.env.GP_FILE_PATH}/Template/`,
        'Salary Adjustment Letter.pdf',
      );
      let dir = libs.find((e) => e.id == data.ASETYP).path;
      if (!dir) dir = 'Non-Manager';
      this.output_path = `${process.env.GP_FILE_PATH}/${dir}/Salary Adjustment Letter (หนังสือแจ้งปรับ)/${data.ASEFDT}/`;
      const fontPath = path.join(process.cwd(), 'public/fonts/THSarabun.ttf');
      const [existingPdfBytes, fontBytes] = await Promise.all([
        fs.readFile(templatePath),
        fs.readFile(fontPath),
      ]);
      this.pdfdoc = await PDFDocument.load(existingPdfBytes);
      this.pdfdoc.registerFontkit(fontkit);
      this.fontstyle = await this.pdfdoc.embedFont(fontBytes);
      const pages = this.pdfdoc.getPages();

      this.fontsize = 14;
      this.pdfpage = pages[0];
      //   await drawGrid(this.pdfpage, 10);
      await this.setPdfValue(data);
      const pdfBytes = await this.pdfdoc.save();
      await fs.mkdir(this.output_path, { recursive: true });
      const output = path.join(this.output_path, `_${data.ASECOD}.pdf`);
      await fs.writeFile(output, pdfBytes);
      await protectedFile({
        output_path: this.output_path,
        input: `_${data.ASECOD}.pdf`,
        output: `${data.ASECOD}.pdf`,
        userpassword: data.BIRTHDAY.toString(),
        adminpassword: data.passkey,
        delete_input: true,
      });
      return output;
    } catch (error) {
      console.error('Error filling PDF template:', error);
      throw new Error('Failed to fill PDF template');
    }
  }

  async setPdfValue(data: any) {
    const lineOption = {
      pdfpage: this.pdfpage,
      fontstyle: this.fontstyle,
      fontsize: this.fontsize,
      drawBorder: false,
      text: '',
      boxX: 0,
      boxY: 0,
      boxWidth: '100',
      boxHeight: 10,
      align: 'left',
    };
    // prettier-ignore
    {
        //dayjs.locale('th');
        writeLineBox({...lineOption, text: `${data.SEMPPRT}${data.STNAME}`, boxX: 95, boxY: 145, boxWidth: 170, boxHeight: 15, align: 'left'});
        writeLineBox({...lineOption, text: data.ASECOD, boxX: 330, boxY: 145, boxWidth: 55, boxHeight: 15, align: 'center'});
        const org = `${data.SSEC.toUpperCase().replace(' SEC.','')}/${data.SDEPT.toUpperCase().replace(' DEPT.','')}/${data.SDIV.toUpperCase().replace(' DIV.','')}`;
        writeLineBox({...lineOption, text: org, boxX: 460, boxY: 145, boxWidth: 90, boxHeight: 15, align: 'center'});

        if(data.ASCYCL == 'A')
            writeLineBox({...lineOption, text: 'X', boxX: 144, boxY: 178, boxWidth: 15, boxHeight: 15, align: 'center'});
        if(data.OLDPOSITION !== data.NEWPOSITION)
            writeLineBox({...lineOption, text: 'X', boxX: 144, boxY: 198, boxWidth: 15, boxHeight: 15, align: 'center'});
        if(data.OLDPOSITION===data.NEWPOSITION && data.OLDLEVEL !== data.NEWLEVEL)
            writeLineBox({...lineOption, text: 'X', boxX: 144, boxY: 218, boxWidth: 15, boxHeight: 15, align: 'center'});
        // writeLineBox({...lineOption, text: 'X', boxX: 144, boxY: 238, boxWidth: 15, boxHeight: 15, align: 'center'});

        //Previous
        writeLineBox({...lineOption, text: digitsNumber(data.OLDSALARY,0), boxX: 240, boxY: 365, boxWidth: 160, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: data.OLDPOSITION, boxX: 240, boxY: 385, boxWidth: 160, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: data.OLDLEVEL, boxX: 240, boxY: 405, boxWidth: 160, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.OLDJOBAW,0), boxX: 240, boxY: 425, boxWidth: 160, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.OLDEXAW,0), boxX: 240, boxY: 445, boxWidth: 160, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.OLDSPAW,0), boxX: 240, boxY: 465, boxWidth: 160, boxHeight: 20, align: 'center'});

        //New
        writeLineBox({...lineOption, text: digitsNumber(data.NEWSALARY, 0), boxX: 405, boxY: 365, boxWidth: 150, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: data.NEWPOSITION, boxX: 405, boxY: 385, boxWidth: 150, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: data.NEWLEVEL, boxX: 405, boxY: 405, boxWidth: 150, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.NEWJOBAW,0), boxX: 405, boxY: 425, boxWidth: 150, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.NEWEXAW,0), boxX: 405, boxY: 445, boxWidth: 150, boxHeight: 20, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.NEWSPAW,0), boxX: 405, boxY: 465, boxWidth: 150, boxHeight: 20, align: 'center'});

        const effdate = dayjs(data.ASEFDT.toString(), 'YYYYMMDD').locale('th').format('DD MMMM YYYY');
        writeLineBox({...lineOption, text: effdate, boxX: 200, boxY: 498, boxWidth: 130, boxHeight: 15, align: 'center'});

        lineOption.fontsize = 10;
        const date = dayjs().format('YYYY/MM/DD HH:mm:ss');;
        writeLineBox({...lineOption, fontsize: 10, text: date, boxX: 59, boxY: 655, boxWidth: 130, boxHeight: 10, align: 'left'});
    }
  }

  async createExcel(data: any[]) {
    const templatePath = path.resolve(
      process.cwd(),
      'public/export/promote.xlsx',
    );

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);
      const sheet = workbook.getWorksheet(1);
      for (const [index, row] of data.entries()) {
        const sourceStyleRow = index % 2 === 0 ? 3 : 4;
        if (index > 1) {
          await cloneRows(sheet, sourceStyleRow, sheet.lastRow.number + 1);
        }
        // prettier-ignore
        {
        const effdate = dayjs(row.ASEFDT.toString(), 'YYYYMMDD').locale('th').format('DD MMMM YYYY');
        sheet.getCell(index + 3, 1).value = row.ASYEAR;
        sheet.getCell(index + 3, 2).value = row.ASCYCL == 'A' ? 'April' : 'October';
        sheet.getCell(index + 3, 3).value = row.ASECOD;
        sheet.getCell(index + 3, 4).value = `${row.SEMPPRT}${row.STNAME}`;
        sheet.getCell(index + 3, 5).value = row.SPOSNAME;
        sheet.getCell(index + 3, 6).value = row.SDIV;
        sheet.getCell(index + 3, 7).value = row.SDEPT;
        sheet.getCell(index + 3, 8).value = row.SSEC;
        sheet.getCell(index + 3, 9).value = row.ASCYCL == 'A' ? 'P' : '';
        sheet.getCell(index + 3, 10).value = row.OLDPOSITION !== row.NEWPOSITION ? 'P' : '';
        sheet.getCell(index + 3, 11).value = row.OLDPOSITION === row.NEWPOSITION && row.OLDLEVEL !== row.NEWLEVEL ? 'P' : '';
        sheet.getCell(index + 3, 12).value = '';
        sheet.getCell(index + 3, 13).value = intVal(row.OLDSALARY);
        sheet.getCell(index + 3, 14).value = row.OLDPOSITION;
        sheet.getCell(index + 3, 15).value = row.OLDLEVEL;
        sheet.getCell(index + 3, 16).value = intVal(row.OLDJOBAW);
        sheet.getCell(index + 3, 17).value = intVal(row.OLDEXAW);
        sheet.getCell(index + 3, 18).value = intVal(row.OLDSPAW);
        sheet.getCell(index + 3, 19).value = intVal(row.NEWSALARY);
        sheet.getCell(index + 3, 20).value = row.NEWPOSITION;
        sheet.getCell(index + 3, 21).value = row.NEWLEVEL;
        sheet.getCell(index + 3, 22).value = intVal(row.NEWJOBAW);
        sheet.getCell(index + 3, 23).value = intVal(row.NEWEXAW);
        sheet.getCell(index + 3, 24).value = intVal(row.NEWSPAW);
        sheet.getCell(index + 3, 25).value = effdate;
        }
      }
      const buffer = await workbook.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      console.error('Error reading Excel template:', error);
      throw new InternalServerErrorException(
        'Invalid template: Missing "Data" sheet.',
      );
    }
  }
}
