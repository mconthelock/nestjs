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
import {
  convertNumberToBahtText,
  digitsNumber,
  intVal,
} from '../../common/helpers/baht-text.helper';
import {
  drawGrid,
  writeLineBox,
  protectedFile,
} from '../../common/helpers/file-pdf.helper';
import { cloneRows } from '../../common/helpers/file-excel.helper';
import { DatabaseService } from '../shared/database.service';
import * as oracledb from 'oracledb';
const fontkit = require('@pdf-lib/fontkit');

@Injectable()
export class TwidocService {
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

      const { passcode } =
        await this.dbService.getHrAdminCredentials(credentials);

      const result = await conn.execute(
        `DECLARE v_cursor SYS_REFCURSOR;
        BEGIN
            TWI50(:KEYVALUE, :NYEAR, :EMTYPE, v_cursor);
            :result := v_cursor;
        END;`,
        {
          KEYVALUE: passcode,
          NYEAR: body.year,
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
      console.error('Error fetching Twi 50 data:', error);
      throw new InternalServerErrorException('Failed to fetch Twi 50 data.');
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

      // Add your query logic here
      const { passcode } =
        await this.dbService.getHrAdminCredentials(credentials);
      const result = await conn.execute(
        `DECLARE v_cursor SYS_REFCURSOR;
        BEGIN
            TWIEMPLOYEE(:KEYVALUE, :NYEAR, :EMPID, v_cursor);
            :result := v_cursor;
        END;`,
        {
          KEYVALUE: passcode,
          NYEAR: body.year,
          EMPID: body.empno,
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
      throw new InternalServerErrorException('Failed to fetch Twi 50 data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }

  async adjust(credentials: any, body: any) {
    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(credentials);
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;

      // Add your query logic here
      const { admin } = await this.dbService.getHrAdminCredentials(credentials);
      const result = await conn.execute(
        `UPDATE MHEPAYTWI
          SET TWIADDINCOME = :income, TWIADDTAX= :tax, TWIADDUSER = :admin, TWIADDUPDATE = SYSDATE
          WHERE TWIEMPCOD = :empno AND TWIYEAR = :year`,
        {
          empno: body.empno,
          year: body.year,
          income: body.income,
          tax: body.tax,
          admin: admin,
        },
        {
          autoCommit: true,
        },
      );
      return result;
      //   return null;
    } catch (error) {
      console.error('Error fetching Twi 50 data:', error);
      throw new InternalServerErrorException('Failed to fetch Twi 50 data.');
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
        'Withholding Tax Certificate.pdf',
      );

      let dir = libs.find((e) => e.id == data.EMPPOSITION).path;
      if (!dir) dir = 'Non-Manager';
      this.output_path = `${process.env.GP_FILE_PATH}/${dir}/Withholding Tax Certificate (50 ทวิ)/${data.TWIYEAR}/`;
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
      await this.setPdfValue(data);
      //   await drawGrid(this.pdfpage, 10);
      this.fontsize = 14;
      this.pdfpage = pages[1];
      await this.setPdfValue(data);

      const pdfBytes = await this.pdfdoc.save();

      await fs.mkdir(this.output_path, { recursive: true });
      const output = path.join(this.output_path, `_${data.EMPCOD}.pdf`);
      await fs.writeFile(output, pdfBytes);
      await protectedFile({
        output_path: this.output_path,
        input: `_${data.EMPCOD}.pdf`,
        output: `${data.EMPCOD}.pdf`,
        userpassword: data.PSNBDT,
        adminpassword: data.passkey,
        delete_input: true,
      });
      return output;
    } catch (error) {
      console.error('Error filling PDF template:', error);
      throw new Error('Failed to fill PDF template');
    }
  }

  private async setPdfValue(data: any) {
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
        dayjs.locale('th');
        const month = data.TWIEND == 13 ? 12 : data.TWIEND;
        const lastmonth = dayjs().month(month - 1).format('MMM');
        const periodText = data.TWIEND == 1 ? `ม.ค.` : `ม.ค. - ${lastmonth}`;
        writeLineBox({...lineOption, text: data.SEQ_NO.toString(), boxX: 505, boxY: 50, boxWidth: 50, boxHeight: 10, align: 'center'});
        writeLineBox({...lineOption, text: data.EMPNMT, boxX: 60, boxY: 163, boxWidth: 200, boxHeight: 15, align: 'left'});
        writeLineBox({...lineOption, text: this.formatPNID(data.PSNIDN), boxX: 450, boxY: 148, boxWidth: 120, boxHeight: 15, align: 'left'});
        writeLineBox({...lineOption, text: this.formatPNID(data.PSNIDN), boxX: 450, boxY: 165, boxWidth: 120, boxHeight: 15, align: 'left'});
        writeLineBox({...lineOption, text: data.EMPADDR, boxX: 60, boxY: 195, boxWidth: 400, boxHeight: 15, align: 'left'});
        writeLineBox({...lineOption, text: data.SEQ_NO.toString(), boxX: 70, boxY: 222, boxWidth: 60, boxHeight: 15, align: 'center'});
        writeLineBox({...lineOption, text: periodText, boxX: 365, boxY: 293, boxWidth: 65, boxHeight: 10, align: 'center'});
        writeLineBox({...lineOption, text: (data.TWIYEAR+543).toString(), boxX: 365, boxY: 303, boxWidth: 65, boxHeight: 10, align: 'center'});
        writeLineBox({...lineOption, text: digitsNumber(data.TWIINCOME,2), boxX: 432, boxY: 293, boxWidth: 64, boxHeight: 10, align: 'right'});
        writeLineBox({...lineOption, text: digitsNumber(data.TWITAX,2), boxX: 500, boxY: 293, boxWidth: 63, boxHeight: 10, align: 'right'});

        if(data.TWIADDINCOME && data.TWIADDINCOME > 0){
            writeLineBox({...lineOption, text: digitsNumber(data.TWIADDINCOME,2), boxX: 432, boxY: 560, boxWidth: 64, boxHeight: 10, align: 'right'});
            writeLineBox({...lineOption, text: digitsNumber(data.TWIADDTAX,2), boxX: 500, boxY: 560, boxWidth: 63, boxHeight: 10, align: 'right'});
        }

        const totalIncome = intVal(data.TWIINCOME) + intVal(data.TWIADDINCOME);
        const totalTax = intVal(data.TWITAX) + intVal(data.TWIADDTAX);
        writeLineBox({...lineOption, text: digitsNumber(totalIncome,2), boxX: 432, boxY: 580, boxWidth: 64, boxHeight: 10, align: 'right'});
        writeLineBox({...lineOption, text: digitsNumber(totalTax,2), boxX: 500, boxY: 580, boxWidth: 63, boxHeight: 10, align: 'right'});

        const bahtText = await convertNumberToBahtText(totalTax);
        writeLineBox({...lineOption, text: bahtText, boxX: 172, boxY: 600, boxWidth: 300, boxHeight: 15, align: 'left'});
        writeLineBox({...lineOption, text: digitsNumber(data.TWIPVF,2), boxX: 340, boxY: 625, boxWidth: 80, boxHeight: 10, align: 'right'});
        writeLineBox({...lineOption, text: digitsNumber(data.TWISSO,2), boxX: 240, boxY: 640, boxWidth: 83, boxHeight: 10, align: 'right'});
        writeLineBox({...lineOption, text: this.formatPNID(data.PSNIDN), boxX: 373, boxY: 655, boxWidth: 140, boxHeight: 10, align: 'center'});

        dayjs.locale('th');
        const date = dayjs();
        writeLineBox({...lineOption, text: `${date.format('DD')} ${date.format('MMMM')} ${date.year() + 543}`, boxX: 180, boxY: 732, boxWidth: 130, boxHeight: 10, align: 'center'});
        lineOption.fontsize = 10;
        writeLineBox({...lineOption, fontsize: 10, text: `${date.format('DD/MM')}/${date.year() + 543} ${date.format('HH:mm:ss')}`, boxX: 440, boxY: 715, boxWidth: 130, boxHeight: 10, align: 'left'});
      }
  }

  private formatPNID(inputString) {
    const checkRegex = /^\d{13}$/;
    if (!checkRegex.test(inputString)) {
      return '';
    }
    const formatRegex = /^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/;
    return inputString.replace(formatRegex, '$1 $2 $3 $4 $5');
  }

  async createExcel(data: any) {
    // prettier-ignore
    const templatePath = path.resolve(process.cwd(),'public/export/twidoc.xlsx');
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);
      const sheet = workbook.getWorksheet(1);
      data.sort((a, b) => a.SEQ_NO - b.SEQ_NO);
      for (const [index, row] of data.entries()) {
        const sourceStyleRow = index % 2 === 0 ? 2 : 3;
        if (index > 1) {
          await cloneRows(sheet, sourceStyleRow, sheet.lastRow.number + 1);
        }
        sheet.getCell(index + 2, 1).value = row.TWIYEAR;
        sheet.getCell(index + 2, 2).value = row.SEQ_NO;
        sheet.getCell(index + 2, 3).value = row.EMPCOD;
        sheet.getCell(index + 2, 4).value = row.EMPNMT;
        sheet.getCell(index + 2, 5).value = row.SPOSITION;
        sheet.getCell(index + 2, 6).value = row.SDIV;
        sheet.getCell(index + 2, 7).value = row.SDEPT;
        sheet.getCell(index + 2, 8).value = row.SSEC;
        sheet.getCell(index + 2, 9).value =
          intVal(row.TWIINCOME) + intVal(row.TWIADDINCOME);
        sheet.getCell(index + 2, 10).value =
          intVal(row.TWITAX) + intVal(row.TWIADDTAX);
        sheet.getCell(index + 2, 11).value = intVal(row.TWIPVF);
        sheet.getCell(index + 2, 12).value = intVal(row.TWISSO);
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
