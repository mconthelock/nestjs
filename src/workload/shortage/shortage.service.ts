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
      ) {}
  create(createShortageDto: CreateShortageDto) {
    return 'This action adds a new shortage';
  }

  findAll() {
    return `This action returns all shortage nn (controller_shortage call) `;
  }

  /*findOne(id: number) {
    return `This action returns a #${id} shortage`;
  }*/

  /*update(id: number, updateShortageDto: UpdateShortageDto) {
    return `This action updates a #${id} shortage`;
  }*/

  /* remove(id: number) {
    return `This action removes a #${id} shortage`;
  }*/

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
   
  async getshortageReportNoEntity() {
    const result = await this.shortageRepository.get_shortagereport_noentity();
     return {
        status: 'success',
        total_rows: result.length,
        items: result 
    };
  }

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
