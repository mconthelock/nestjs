import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateService {
    constructor() {}

    async main(dto: any, files: Express.Multer.File[]) {
        try {
            // todo: บันทึกข้อมูล
            

            // todo: บันทึกไฟล์
            return { dto, files };
        } catch (error) {
            throw error;
        }
    }
}
