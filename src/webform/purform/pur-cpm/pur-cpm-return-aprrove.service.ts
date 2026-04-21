import { Injectable } from '@nestjs/common';
import { PurCpmService } from './pur-cpm.service';
import { ReturnArppoveDto } from './dto/update-pur-cpm.dto';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { PurCpmRepository } from './pur-cpm.repository';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormService } from 'src/webform/form/form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { PurFileService } from '../pur-file/pur-file.service';
import { RepService } from 'src/webform/rep/rep.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';

@Injectable()
export class PurCpmReturnAprroveService extends PurCpmService {
    constructor(
        protected readonly repo: PurCpmRepository,
        protected readonly formService: FormService,
        protected readonly flowService: FlowService,
        protected readonly formmstService: FormmstService,
        protected readonly purFileService: PurFileService,
        protected readonly repService: RepService,
        protected readonly deleteFlowStepService: DeleteFlowStepService,
        protected readonly insertFlowStepService: InsertFlowStepService,
        private readonly doactionService: DoactionFlowService,
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
    async returnApprove(
        dto: ReturnArppoveDto,
        files: Express.Multer.File[],
        path: string,
        ip: string,
    ) {
        let movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
        try {
            //prettier-ignore
            const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, ACTION, EMPNO, REMARK, THIRD_PARTY, DELETE_FILES, ...data } = dto;

            const form = {
                NFRMNO: NFRMNO,
                VORGNO: VORGNO,
                CYEAR: CYEAR,
                CYEAR2: CYEAR2,
                NRUNNO: NRUNNO,
            };
            // 1. ดึงข้อมูล flow ปัจจุบันของ form นี้ขึ้นมาเพื่อตรวจสอบว่า มีการเปลี่ยนแปลง flow หรือไม่ (โดยดูจากเงื่อนไขที่กำหนดในข้อ 2-4)
            const flowtree = await this.flowService.getFlowTree(form);
            let flagReset = false;

            // 2. หากมี THIRD_PARTY ให้เพิ่ม flow cstepno 40
            const hasStep40 = flowtree.some((f: FLOWMST) => f.CSTEPNO === '40');
            if (THIRD_PARTY && !hasStep40) {
                await this.insertThridPartyStep(form, THIRD_PARTY);
                flagReset = true;
            }
            if (!THIRD_PARTY && hasStep40) {
                await this.deleteStep(form, ['40']);
                flagReset = true;
            }
            // 3. เมื่อ PAYMENT ต่ำกว่า 10,000 ให้ลบ flow ddim, dim ออก
            const hasStep03 = flowtree.some((f: FLOWMST) => f.CSTEPNO === '03');
            const hasStep02 = flowtree.some((f: FLOWMST) => f.CSTEPNO === '02');

            if (data.PAYMENT < 10000) {
                if (hasStep03) {
                    await this.deleteStep(form, '03');
                    flagReset = true;
                }
                if (hasStep02) {
                    await this.deleteStep(form, '02');
                    flagReset = true;
                }
            }
            // 4. เมื่อ PAYMENT มากกว่าหรือเท่ากับ 10,000 ให้เพิ่ม flow ddim, dim กลับมา (ถ้ายังไม่มี)
            if (data.PAYMENT >= 10000) {
                if (!hasStep03) {
                    await this.insertFlowStepService.insertFlowStep({
                        ...form,
                        NEWSTEPNO: '03',
                        BEFORESTEPNO: '04',
                        CTYPE: '1',
                    });
                    flagReset = true;
                }
                if (!hasStep02) {
                    await this.insertFlowStepService.insertFlowStep({
                        ...form,
                        NEWSTEPNO: '02',
                        BEFORESTEPNO: '03',
                        CTYPE: '1',
                    });
                    flagReset = true;
                }
            }

            // 5. หากมีการเปลี่ยนแปลง flow ให้ทำการ reset flow โดยการส่ง action 'returnp' ก่อน แล้วค่อยส่ง action 'approve' อีกครั้ง (ถ้าไม่มีการเปลี่ยนแปลง flow จะข้ามขั้นตอนนี้ไปเลย)
            if (flagReset) {
                await this.doactionService.doAction(
                    { ...form, ACTION: 'returnp', EMPNO },
                    ip,
                );
            }

            // 6. update ข้อมูล PUR-CPM
            await this.update(form, {
                ...data,
            });

            // 7. ลบไฟล์ที่ถูกระบุให้ลบ (ถ้ามี)
            if (DELETE_FILES && DELETE_FILES.length > 0) {
                for (const id of DELETE_FILES) {
                    const file = await this.purFileService.getFileById(+id);
                    await this.purFileService.deleteFileByID(+id);
                    const destination = await joinPaths(
                        file.FILE_PATH,
                        file.FILE_FNAME,
                    );
                    await deleteFile(destination);
                }
            }

            // 8. ย้ายไฟล์ไปยังปลายทางและ Insert ข้อมูลไฟล์ใหม่ (ถ้ามี)
            if (files && files.length > 0) {
                movedTargets = await this.moveFiles(files, form, path, EMPNO);
            }

            // 9. ส่ง action 'approve' เพื่ออนุมัติคำขอกลับไปยังหัวหน้า (หรือผู้อนุมัติคนถัดไป) โดยไม่ต้องเช็คเงื่อนไขใดๆ เพิ่มเติม เพราะถือว่าการเปลี่ยนแปลง flow และการอัพเดตข้อมูลเสร็จสมบูรณ์แล้ว
            await this.doactionService.doAction(
                { ...form, ACTION: 'approve', EMPNO, REMARK },
                ip,
            );
            return {
                status: true,
                message: 'Request successful',
            };
        } catch (error) {
            await Promise.allSettled([
                ...movedTargets.map((p) => deleteFile(p)), // - ลบไฟล์ที่ "ปลายทาง" ทั้งหมดที่ย้ายสำเร็จไปแล้ว (กัน orphan file)
                ...files.map((f) => deleteFile(f.path)), // - ลบไฟล์ใน tmp ที่ยังไม่ได้ย้าย (กันค้าง)
            ]);
            throw new Error(
                'Return Approve PUR-CPM Form Error: ' + error.message,
            );
        }
    }
}
