import { Injectable } from '@nestjs/common';
import { deleteFile } from 'src/common/utils/files.utils';
import { IeBgrService } from './ie-bgr.service';
import { DraftIeBgrDto } from './dto/create-ie-bgr.dto';

@Injectable()
export class IeBgrDraftService extends IeBgrService {
    /**
     * บันทึกแบบร่าง (Draft)
     */
    async draft(
        dto: DraftIeBgrDto,
        files: Partial<
            Record<keyof typeof this.fileType, Express.Multer.File[]>
        >,
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        let returnDelFiles: string[] = []; // เก็บ path ไฟล์ที่ต้องลบในกรณี Return
        try {
            // 1. สร้าง Form
            const form = await this.createForm({
                dto,
                ip,
                isReturn: dto.isReturn || false,
                isSave: dto.isSave || false,
                isDraft: dto.isDraft || false,
                Draft: dto.DRAFT || '',
            });
            // 2. เตรียม path สำหรับเก็บไฟล์
            const destination = await this.createPath(form, path);
            // 3. Insert EBGREQFORM
            const resEbgform = await this.insertEbgreqform({ dto, form });

            // 4. บันทึกไฟล์
            const { isReturn, returnData } = dto;
            const insertFileRes = await this.insertFiles({
                isReturn,
                returnData,
                form,
                files,
                destination,
                movedTargets,
                returnDelFiles,
            });
            movedTargets = insertFileRes.movedTargets;
            returnDelFiles = insertFileRes.returnDelFiles;

            // 5. บันทึก Quotation และ Quotation Product
            const quotation = await this.insertQuotations({
                isReturn: dto.isReturn,
                returnData: dto.returnData,
                form,
                quotation: dto.quotation,
                createBy: dto.empInput,
            });

            // 6 กรณีเป็นการ Return ให้ลบไฟล์ที่เตรียมไว้
            if (dto.isReturn) {
                for (const filePath of returnDelFiles) {
                    await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
                }
            }
            return {
                status: true,
                message: 'Draft successful',
            };
        } catch (error) {
            for (const filePath of movedTargets) {
                await deleteFile(filePath); // ลบไฟล์ที่ย้ายสำเร็จไปแล้ว
            }
            throw new Error(error.message);
        }
    }
}
