import { Injectable } from '@nestjs/common';
import { IeBgrService } from './ie-bgr.service';
import { CreateIeBgrDto } from './dto/create-ie-bgr.dto';
import { deleteFile } from 'src/common/utils/files.utils';

@Injectable()
export class IeBgrCreateService extends IeBgrService {
    /**
     * Create IE-BGR form
     */
    async create(
        dto: CreateIeBgrDto,
        files: Partial<
            Record<keyof typeof this.fileType, Express.Multer.File[]>
        >,
        // {
        //   imageI?: Express.Multer.File[];
        //   imageP?: Express.Multer.File[];
        //   imageD?: Express.Multer.File[];
        //   imageN?: Express.Multer.File[];
        //   imageE?: Express.Multer.File[];
        //   imageS?: Express.Multer.File[];
        //   fileP?: Express.Multer.File[];
        //   fileR?: Express.Multer.File[];
        //   fileS?: Express.Multer.File[];
        //   fileM?: Express.Multer.File[];
        //   fileE?: Express.Multer.File[];
        //   fileO?: Express.Multer.File[];
        // },
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        let returnDelFiles: string[] = []; // เก็บ path ไฟล์ที่ต้องลบในกรณี Return
        try {
            // 1. ตรวจสอบกรณีเป็นการ Return
            const form = await this.createForm({
                dto,
                ip,
                isReturn: dto.isReturn,
            });

            // 2. เตรียม path สำหรับเก็บไฟล์
            const destination = await this.createPath(form, path);

            // 3. Insert EBGREQFORM
            const resEbgform = await this.insertEbgreqform({
                dto,
                form,
            });

            // 4. บันทึกไฟล์
            const insertFile = await this.insertFiles({
                isReturn: dto.isReturn,
                returnData: dto.returnData,
                form,
                files,
                destination,
                movedTargets,
                returnDelFiles,
            });
            movedTargets = insertFile.movedTargets;
            returnDelFiles = insertFile.returnDelFiles;

            // 5. บันทึก Quotation และ Quotation Product
            const quotation = await this.insertQuotations({
                isReturn: dto.isReturn,
                returnData: dto.returnData,
                form,
                quotation: dto.quotation,
                createBy: dto.empInput,
            });

            // 6. ส่งเมลแจ้ง
            await this.doactionFlowService.sendMailToApprover(form);

            // 7 กรณีเป็นการ Return ให้ลบไฟล์ที่เตรียมไว้
            if (dto.isReturn) {
                for (const filePath of returnDelFiles) {
                    await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
                }
            }

            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            for (const filePath of movedTargets) {
                await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
            }
            throw new Error(error.message);
        }
    }
}
