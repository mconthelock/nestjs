import { Injectable } from '@nestjs/common';
import { CreateStyFilesDto, InsertAndMoveStyFilesDto } from './dto/create.dto';
import { StyTypeService } from '../sty-type/sty-type.service';

@Injectable()
export class StyFilesService {
    constructor(private readonly typeService: StyTypeService) {}
    async insertFiles(
        dto: InsertAndMoveStyFilesDto,
        file: Express.Multer.File | Express.Multer.File[],
    ) {
        const { FILE_CODE, FILE_PATH, FILE_USERCREATE } = dto;
        try {
            if (!file || (Array.isArray(file) && file.length === 0)) {
                throw new Error('No file uploaded');
            }
            let fileId: number;

            if (FILE_CODE) {
                const fileTypeRes =
                    await this.typeService.findOneByCode(FILE_CODE);
                fileId = fileTypeRes.data.TYPE_ID;
            }
            const destination =
                FILE_PATH ?? (await this.createDestinationPath());
            return;
            // const destination = await this.createDestinationPath(
            //     form,
            //     PATH,
            //     FORM_TYPE,
            // );
            // const moved = await this.moveAndInsertFile({
            //     files: Array.isArray(file) ? file : [file],
            //     destination,
            //     form,
            //     formType: FORM_TYPE,
            //     createBy: CREATEBY,
            //     fileType: fileType, // ส่งค่า NID ของประเภทไฟล์ถ้ามี FILE_CODE และพบข้อมูลในฐานข้อมูล
            // });
            // return {
            //     status: true,
            //     destination,
            //     moved,
            // };
        } catch (error) {
            throw new Error(error);
        }
    }

    async createDestinationPath() {
        try {
            const path = ``;
        } catch (error) {
            throw new Error(error);
        }
    }
}
