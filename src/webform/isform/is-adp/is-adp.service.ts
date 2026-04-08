import { Injectable } from '@nestjs/common';
import { CreateIsAdpDto, insertIsAdpDto } from './dto/create-is-adp.dto';
import { FormService } from 'src/webform/form/form.service';
import { deleteFile, moveFileFromMulter } from 'src/common/utils/files.utils';
import { IsFileService } from '../is-file/is-file.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { IsAdpRepository } from './is-adp.repository';

@Injectable()
export class IsAdpService {
    constructor(
        private readonly isAdpRepository: IsAdpRepository,
        private readonly formService: FormService,
        private readonly isFileService: IsFileService,
        private readonly formCreateService: FormCreateService,
    ) {}

    async getData(dto: FormDto) {
        return this.isAdpRepository.getData(dto);
    }

    async create(
        dto: CreateIsAdpDto,
        file: Express.Multer.File,
        ip: string,
        path: string,
    ) {
        let movedTargets: string; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            // 1. สร้าง Form ก่อน
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: dto.REQUESTER,
                    INPUTBY: dto.CREATEBY,
                    REMARK: dto.REMARK,
                },
                ip,
            );

            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            // 2. บันทึกข้อมูล IS-ADP
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };

            await this.insert(form, dto.data);

            // 3. ย้ายไฟล์ไปยังปลายทาง
            const formNo = await this.formService.getFormno(form); // Get the form number
            const destination = path + '/' + formNo; // Get the destination path
            const moved = await moveFileFromMulter({ file, destination });
            movedTargets = moved.path;
            // 4. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
            await this.isFileService.insert({
                ...form,
                FILE_ONAME: file.originalname,
                FILE_FNAME: moved.newName,
                FILE_USERCREATE: dto.REQUESTER,
                FILE_PATH: destination,
            });

            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            await deleteFile(movedTargets); // ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            await deleteFile(file.path); // ลบไฟล์ใน tmp ออก
            return { status: false, message: 'Error: ' + error.message };
        }
    }

    async insert(form: FormDto, data: insertIsAdpDto[]) {
        try {
            const dataInsert = data.map((d) => {
                return {
                    ...form,
                    ...d,
                };
            });

            const res = await this.isAdpRepository.insert(dataInsert);
            return {
                status: true,
                message: 'Insert IS-ADP Form Successfully',
            };
        } catch (error) {
            throw new Error('Insert IS-ADP Form Error: ' + error.message);
        }
    }
}
