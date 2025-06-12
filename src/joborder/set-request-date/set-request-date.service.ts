import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetRequestDate } from './entities/set-request-date.entity';
import { UpsertSetRequestDateDto } from './dto/create-set-request-date.dto';

// กำหนด Interface สำหรับผลลัพธ์ที่คืนกลับไป
interface UpsertResult {
  record: SetRequestDate;
  status: 201 | 200;
}

@Injectable()
export class SetRequestDateService {
    constructor(
    @InjectRepository(SetRequestDate, 'amecConnection')
    private setRequestDateRepository: Repository<SetRequestDate>,
  ) {}
  
 

  // เมธอดสำหรับทำ Upsert (เช็คแล้วสร้างหรือแก้ไข)
  async upsert(upsertDto: UpsertSetRequestDateDto): Promise<UpsertResult> {
    const { JOP_PONO, JOP_LINENO, ...updateData } = upsertDto; // แยก PONO, LINENO ออกจากข้อมูลที่จะอัปเดต

    // ค้นหาว่ามี Record นี้อยู่แล้วหรือไม่ โดยใช้ Composite Primary Key
    const existingRecord = await this.setRequestDateRepository.findOneBy({
      JOP_PONO,
      JOP_LINENO,
    });

    // เตรียมข้อมูลสำหรับบันทึก/อัปเดต โดยแปลง string วันที่ให้เป็น Date object
    const dataToSave: Partial<SetRequestDate> = {
      JOP_PONO,
      JOP_LINENO,
      JOP_REQUESTDATE: updateData.JOP_REQUESTDATE ? new Date(updateData.JOP_REQUESTDATE+' 00:00:00') : null,
    };
    
    try {
      if (existingRecord) {
        // ถ้ามี Record อยู่แล้ว: ทำการอัปเดต
        dataToSave.JOP_USERUPDATE = updateData.ACTION_BY; // ใช้ ACTION_BY เป็นผู้สร้าง
        dataToSave.JOP_UPDATEDATE = updateData.ACTION_DATE ? new Date(updateData.ACTION_DATE) : null;
        console.log(`Updating record with PONO: ${JOP_PONO}, LINENO: ${JOP_LINENO}`);
        // ใช้ Object.assign เพื่อรวมข้อมูลเก่ากับข้อมูลใหม่
        Object.assign(existingRecord, dataToSave);
        const updatedRecord = await this.setRequestDateRepository.save(existingRecord);
        return { record: updatedRecord, status: 200 }; // คืนค่าสถานะ updated
      } else {
        // ถ้ายังไม่มี Record: ทำการสร้างใหม่
        dataToSave.JOP_USERCREATE = updateData.ACTION_BY; // ใช้ ACTION_BY เป็นผู้สร้าง
        console.log(`Creating new record with PONO: ${JOP_PONO}, LINENO: ${JOP_LINENO}`);
        const newRecord = this.setRequestDateRepository.create(dataToSave);
        const savedRecord = await this.setRequestDateRepository.save(newRecord);
        return { record: savedRecord, status: 201 }; // คืนค่าสถานะ created
      }
    } catch (error) {
      // ดักจับข้อผิดพลาดที่อาจเกิดขึ้นระหว่างการบันทึกฐานข้อมูล
      console.error(`Error during upsert for PONO: ${JOP_PONO}, LINENO: ${JOP_LINENO}`, error);
      throw new InternalServerErrorException('Error occurred while saving data'); // โยน exception กลับไป
    }

    // if (existingRecord) {
    //   // ถ้ามี Record อยู่แล้ว: ทำการอัปเดต
    //   dataToSave.JOP_USERUPDATE = updateData.ACTION_BY; // ใช้ ACTION_BY เป็นผู้สร้าง
    //   dataToSave.JOP_UPDATEDATE = updateData.ACTION_DATE ? new Date(updateData.ACTION_DATE) : null;
    //   console.log(`Updating record with PONO: ${JOP_PONO}, LINENO: ${JOP_LINENO}`);
    //   // ใช้ Object.assign เพื่อรวมข้อมูลเก่ากับข้อมูลใหม่
    //   Object.assign(existingRecord, dataToSave);
    //   return this.setRequestDateRepository.save(existingRecord);
    // } else {
    //   // ถ้ายังไม่มี Record: ทำการสร้างใหม่
    //   dataToSave.JOP_USERCREATE = updateData.ACTION_BY; // ใช้ ACTION_BY เป็นผู้สร้าง
    //   console.log(`Creating new record with PONO: ${JOP_PONO}, LINENO: ${JOP_LINENO}`);
    //   const newRecord = this.setRequestDateRepository.create(dataToSave);
    //   return this.setRequestDateRepository.save(newRecord);
    // }

    
  }
}
