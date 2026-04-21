import { Injectable } from '@nestjs/common';
import { PurCpmService } from './pur-cpm.service';
import { CreatePurCpmDto } from './dto/create-pur-cpm.dto';
import { PurCpmRepository } from './pur-cpm.repository';
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { PurFileService } from '../pur-file/pur-file.service';
import { RepService } from 'src/webform/rep/rep.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { deleteFile } from 'src/common/utils/files.utils';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';

@Injectable()
export class PurCpmRequestService extends PurCpmService {
    constructor(
        protected readonly repo: PurCpmRepository,
        protected readonly formService: FormService,
        protected readonly flowService: FlowService,
        protected readonly formmstService: FormmstService,
        protected readonly purFileService: PurFileService,
        protected readonly repService: RepService,
        protected readonly deleteFlowStepService: DeleteFlowStepService,
        protected readonly insertFlowStepService: InsertFlowStepService,
        private readonly formCreateService: FormCreateService,
    ) {
        super(
            repo,
            formService,
            flowService,
            formmstService,
            purFileService,
            repService,
            deleteFlowStepService,
            insertFlowStepService,
        );
    }
    async request(
        dto: CreatePurCpmDto,
        files: Express.Multer.File[],
        ip: string,
        path: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            const { REQBY, INPUTBY, REMARK, ...data } = dto;

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
            if (dto.THIRD_PARTY) {
                await this.insertThridPartyStep(form, dto.THIRD_PARTY);
            }
            // 3. เมื่อ PAYMENT ต่ำกว่า 10,000 ให้ลบ flow ddim, dim ออก
            if (data.PAYMENT < 10000) {
                await this.deleteStep(form, ['03', '02']);
            }
            // 4. บันทึกข้อมูล PUR-CPM
            await this.insert({
                ...data,
                CYEAR2: form.CYEAR2,
                NRUNNO: form.NRUNNO,
            });
            // 5. ย้ายไฟล์ไปยังปลายทางและ Insert ข้อมูลไฟล์ใหม่ (ถ้ามี)
            if (files && files.length > 0) {
                movedTargets = await this.moveFiles(
                    files,
                    form,
                    path,
                    dto.REQBY,
                );
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
            throw new Error('Request PUR-CPM Form Error: ' + error.message);
        }
    }
}
