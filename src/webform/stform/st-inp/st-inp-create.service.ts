import { Injectable } from '@nestjs/common';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { StInpService } from './st-inp.service';
import { deleteFile } from 'src/common/utils/files.utils';

@Injectable()
export class StInpCreateService extends StInpService {
    async create(
        dto: CreateStInpDto,
        ip: string,
        files: Express.Multer.File[],
        path: string,
    ) {
        const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            const formmst =
                await this.formmstService.getFormMasterByVaname('ST-INP');
            if (!formmst) {
                throw new Error('Form master not found for ST-INP');
            }
            const form = await this.createForm(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                    DRAFT: dto.DRAFT,
                },
                ip,
                dto.PA_OWNER,
            );
            movedTargets.push(
                ...(await this.insertList({ form, dto, files, path })),
            );

            // throw new Error('test');
            return {
                status: true,
                data: form,
                message: 'Created Successfully',
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error(
                `Failed to create safety inspection report: ${error.message}`,
            );
        }
    }
}
