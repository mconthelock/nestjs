import { Injectable } from '@nestjs/common';
import { CreateShortageDto } from './dto/create-shortage.dto';
import { UpdateShortageDto } from './dto/update-shortage.dto';
import { ShortageRepository } from './shortage.repository';
import { CreatePurTrackingDto } from './dto/create-purtracking.dto';
import { UpdatePurTrackingDto } from './dto/update-purtracking.dto';
@Injectable()
export class ShortageService {
  constructor(
    private readonly shortageRepository: ShortageRepository,
  ) { }
  create(createShortageDto: CreateShortageDto) {
    return 'This action adds a new shortage';
  }

  findAll() {
    return `This action returns all shortage nn (controller_shortage call) `;
  }



  async getHeadProd5() {
    const result = await this.shortageRepository.get_headprod5();
    return {
      status: 'success',
      total_rows: result.length,
      header: result
    };
  }

  async getShortageReport() {
    const result = await this.shortageRepository.get_shortagereport();
    // จัดรูปแบบ (Transform) ให้ออกมาเป็น Object ที่บรรจุ Array
    return {
      status: 'success',
      total_rows: result.length,
      items: result
    };
  }

  //test get shortage report with sql query
  async getShortageReport_inv() {
    const result = await this.shortageRepository.get_shortagereport();
    const poinvoice = await this.shortageRepository.get_poinvoice();

    const normalizeRecord = <T extends Record<string, any>>(record: T): T =>
      Object.fromEntries(
        Object.entries(record).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ]),
      ) as T;

    const buildCompositeKey = (pono: unknown, item: unknown, line: unknown) =>
      `${String(pono).trim()}_${String(item).trim()}_${String(line).trim()}`;

    // 1. สร้าง Dictionary จาก poinvoice โดยใช้ Composite Key
    const invoiceDict = poinvoice.reduce<Record<string, any>>((acc, invoice) => {
      const normalizedInvoice = normalizeRecord(invoice);
      const compositeKey = buildCompositeKey(
        normalizedInvoice.PONO,
        normalizedInvoice.POITM,
        normalizedInvoice.POLINE,
      );
      acc[compositeKey] = normalizedInvoice;
      return acc;
    }, {});

    // 2. Map เพื่อ Join ข้อมูล result เข้ากับ invoiceDict
    const joinedData = result.map(row => {
      // สร้าง Key ให้เหมือนกับข้างบนเพื่อค้นหา
      // ใช้ PONO, PPROD, PLINE เป็น Key สำหรับ Join
      const normalizedRow = normalizeRecord(row);
      const compositeKey = buildCompositeKey(
        normalizedRow.PONO,
        normalizedRow.ITEM,
        normalizedRow.PLINE,
      );

      // ค้นหาข้อมูล Invoice จาก Dictionary
      const matchedInvoice = invoiceDict[compositeKey];

      return {
        ...normalizedRow,
        // ถ้าเจอข้อมูลก็เอา property ทั้งหมดของ invoice มารวม (ระวังชื่อฟิลด์ซ้ำกัน)
        // หรือจะจัดกลุ่มแยกเป็น Object ใหม่ก็ได้ เช่น invoiceDetails: matchedInvoice || null
        ...matchedInvoice,
        ETD: normalizedRow.ETD ?? matchedInvoice?.POETD ?? normalizedRow.ETD ?? null,  //เพิ่มการตรวจสอบค่า ETD จาก matchedInvoice ถ้าไม่มีให้ใช้ค่าเดิมจาก normalizedRow
        ETA: normalizedRow.ETA ?? matchedInvoice?.POETA ?? normalizedRow.ETA ?? null,  //เพิ่มการตรวจสอบค่า ETA จาก matchedInvoice ถ้าไม่มีให้ใช้ค่าเดิมจาก normalizedRow
        ARV_AMEC: normalizedRow.ARV_AMEC ?? matchedInvoice?.POETAA ?? normalizedRow.ARV_AMEC ?? null, //เพิ่มการตรวจสอบค่า ARV_AMEC จาก matchedInvoice ถ้าไม่มีให้ใช้ค่าเดิมจาก normalizedRow
        SHIP_MODE: normalizedRow.SHIP_MODE ?? matchedInvoice?.POSHIP ?? normalizedRow.SHIP_MODE ?? null, //เพิ่มการตรวจสอบค่า SHIP_MODE จาก matchedInvoice ถ้าไม่มีให้ใช้ค่าเดิมจาก normalizedRow
        INV_NO: normalizedRow.INV_NO ?? matchedInvoice?.POINV ?? normalizedRow.INV_NO ?? null, // เพิ่มฟิลด์ INV_NO จาก matchedInvoice
      };

    });
    //return poinvoice;
    //return joinedData;
    return {
      status: 'success',
      total_rows: joinedData.length,
      items: joinedData
    };
  }


  /*async getshortageReportNoEntity() {
    const result = await this.shortageRepository.get_shortagereport_noentity();
    return {
      status: 'success',
      total_rows: result.length,
      items: result
    };
  }*/

  /**
   * createShortPurTracking
   * @description เพิ่มข้อมูล short_pur_tracking   
   * @param data 
   * @returns 
   */
  async createShortPurTracking(data: CreatePurTrackingDto) {
    return this.shortageRepository.create_short_pur_tracking(data);
  }

  /**
  *  Servive : updateShortPurTracking
  * @description update ข้อมูล short_pur_tracking
  * @param data 
  * @returns
  */
  async updateShortPurTracking(data: UpdatePurTrackingDto) {
    const { PONO, PPROD, PLINE, PORD } = data;
    return this.shortageRepository.update_short_pur_tracking({ PONO, PPROD, PLINE, PORD }, data);
  }



}
