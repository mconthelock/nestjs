import { Injectable } from '@nestjs/common';
import { CreatePurCpmDto, InsertPurCpmDto } from './dto/create-pur-cpm.dto';
import { PURCPM_FORM } from 'src/common/Entities/webform/table/PURCPM_FORM.entity';
import { FormService } from 'src/webform/form/form.service';
import {
    deleteFile,
    joinPaths,
    moveFileFromMulter,
} from 'src/common/utils/files.utils';
import { PurFileService } from '../pur-file/pur-file.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { RepService } from 'src/webform/rep/rep.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurCpmRepository } from './pur-cpm.repository';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';

@Injectable()
export class PurCpmService {
    constructor(
        private readonly repo: PurCpmRepository,
        private readonly formService: FormService,
        private readonly flowService: FlowService,
        private readonly formmstService: FormmstService,
        private readonly purFileService: PurFileService,
        private readonly repService: RepService,
        private readonly formCreateService: FormCreateService,
        private readonly deleteFlowStepService: DeleteFlowStepService,
    ) {}

    findbyYear(year: string) {
        return this.repo.findbyYear(year);
    }

    async getData(dto: FormDto) {
        try {
            return await this.repo.getData(dto);
        } catch (error) {
            throw new Error('Get PUR-CPM Form Error: ' + error.message);
        }
    }

    async create(
        dto: CreatePurCpmDto,
        files: Express.Multer.File[],
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            const { THIRD_PARTY, REQBY, INPUTBY, REMARK, ...data } = dto;

            // 1. สร้าง Form ก่อน
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                },
                ip,
            );

            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }

            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };

            // 2. หากมี THIRD_PARTY ให้เพิ่ม flow cstepno 40
            if (THIRD_PARTY) {
                const formmst =
                    await this.formmstService.getFormMasterByVaname('PUR-CPM');
                const represent = await this.repService.getRepresent({
                    NFRMNO: form.NFRMNO,
                    VORGNO: form.VORGNO,
                    CYEAR: form.CYEAR,
                    VEMPNO: THIRD_PARTY,
                });

                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: '--',
                    },
                    CSTEPNEXTNO: '40',
                });
                await this.flowService.insertFlow({
                    ...form,
                    CSTEPNO: '40',
                    CSTEPNEXTNO: '06',
                    CSTART: '0',
                    CSTEPST: '3',
                    CTYPE: '3',
                    VPOSNO: '30',
                    VAPVNO: THIRD_PARTY,
                    VREPNO: represent,
                    CAPVSTNO: '0',
                    CAPVTYPE: '1',
                    CAPPLYALL: '0',
                    VURL: formmst?.VFORMPAGE || '',
                });
                await this.flowService.resetFlow(form);
            }

            // 3. เมื่อ PAYMENT ต่ำกว่า 10,000 ให้ลบ flow ddim, dim ออก
            if (data.PAYMENT < 10000) {
                await this.deleteFlowStepService.deleteFlowStep({
                    ...form,
                    CSTEPNO: '03',
                });
                await this.deleteFlowStepService.deleteFlowStep({
                    ...form,
                    CSTEPNO: '02',
                });
            }

            // 4. บันทึกข้อมูล PUR-CPM
            await this.repo.insert({
                ...data,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
                INVOICE_TYPE:
                    data.INVOICE_TYPE && typeof data.INVOICE_TYPE !== 'string'
                        ? data.INVOICE_TYPE.join('|')
                        : String(data.INVOICE_TYPE), // แปลง array เป็น string คั่นด้วย |
                ATTACH_TYPE:
                    dto.ATTACH_TYPE && typeof dto.ATTACH_TYPE !== 'string'
                        ? dto.ATTACH_TYPE.join('|')
                        : String(dto.ATTACH_TYPE), // แปลง array เป็น string คั่นด้วย |
            });

            // 5. ย้ายไฟล์ไปยังปลายทาง
            const formNo = await this.formService.getFormno(form); // Get the form number
            const destination = await joinPaths(path, formNo); // Get the destination path
            for (const file of files) {
                const moved = await moveFileFromMulter({ file, destination });
                movedTargets.push(moved.path);
                // 6. บันทึก DB (ใช้ชื่อไฟล์ที่ "ปลายทางจริง" เพื่อความตรงกัน)
                await this.purFileService.insert({
                    ...form,
                    FILE_ONAME: file.originalname, // ชื่อเดิมฝั่ง client
                    FILE_FNAME: moved.newName, // ชื่อไฟล์ที่ใช้เก็บจริง
                    FILE_USERCREATE: dto.REQBY,
                    FILE_PATH: destination, // โฟลเดอร์ปลายทาง
                });
            }

            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error('Create PUR-CPM Form Error: ' + error.message);
        }
    }
}
