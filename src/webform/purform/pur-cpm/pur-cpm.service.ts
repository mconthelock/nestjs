import { Injectable } from '@nestjs/common';
import { FormService } from 'src/webform/form/form.service';
import { joinPaths, moveFileFromMulter } from 'src/common/utils/files.utils';
import { PurFileService } from '../pur-file/pur-file.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { RepService } from 'src/webform/rep/rep.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { PurCpmRepository } from './pur-cpm.repository';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { InsertPurCpmDto } from './dto/create-pur-cpm.dto';
import { UpdatePurCpmDto } from './dto/update-pur-cpm.dto';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';

@Injectable()
export class PurCpmService {
    constructor(
        protected readonly repo: PurCpmRepository,
        protected readonly formService: FormService,
        protected readonly flowService: FlowService,
        protected readonly formmstService: FormmstService,
        protected readonly purFileService: PurFileService,
        protected readonly repService: RepService,
        protected readonly deleteFlowStepService: DeleteFlowStepService,
        protected readonly insertFlowStepService: InsertFlowStepService,
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

    async insert(dto: InsertPurCpmDto) {
        try {
            const res = await this.repo.insert(dto);
            if (res.identifiers.length === 0) {
                throw new Error('Insert PUR-CPM Form Failed');
            }
            return {
                status: true,
                message: 'Insert PUR-CPM Form Success',
            };
        } catch (error) {
            throw new Error('Insert PUR-CPM Form Error: ' + error.message);
        }
    }

    async update(condition: FormDto, data: UpdatePurCpmDto) {
        try {
            const res = await this.repo.update(condition, data);
            if (res.affected === 0) {
                throw new Error(
                    'Update PUR-CPM Form Failed: No record updated',
                );
            }
            return {
                status: true,
                message: 'Update PUR-CPM Form Success',
            };
        } catch (error) {
            throw new Error('Update PUR-CPM Form Error: ' + error.message);
        }
    }

    async insertThridPartyStep(form: FormDto, thirdPartyEmpno: string) {
        try {
            await this.insertFlowStepService.insertFlowStep({
                ...form,
                NEWSTEPNO: '40',
                BEFORESTEPNO: '--',
                CTYPE: '3',
                APVNO: thirdPartyEmpno,
            });
            // const formmst =
            //     await this.formmstService.getFormMasterByVaname('PUR-CPM');
            // const represent = await this.repService.getRepresent({
            //     NFRMNO: form.NFRMNO,
            //     VORGNO: form.VORGNO,
            //     CYEAR: form.CYEAR,
            //     VEMPNO: thirdPartyEmpno,
            // });

            // await this.flowService.updateFlow({
            //     condition: {
            //         ...form,
            //         CSTEPNO: '--',
            //     },
            //     CSTEPNEXTNO: '40',
            // });
            // await this.flowService.insertFlow({
            //     ...form,
            //     CSTEPNO: '40',
            //     CSTEPNEXTNO: '06',
            //     CSTART: '0',
            //     CSTEPST: '3',
            //     CTYPE: '3',
            //     VPOSNO: '30',
            //     VAPVNO: thirdPartyEmpno,
            //     VREPNO: represent,
            //     CAPVSTNO: '0',
            //     CAPVTYPE: '1',
            //     CAPPLYALL: '0',
            //     VURL: formmst?.VFORMPAGE || '',
            // });
            // await this.flowService.resetFlow(form);
        } catch (error) {
            throw new Error('Insert Third Party Step Error: ' + error.message);
        }
    }

    async deleteStep(form: FormDto, stepNo: string | string[]) {
        try {
            const stepNos = Array.isArray(stepNo) ? stepNo : [stepNo];
            for (const no of stepNos) {
                await this.deleteFlowStepService.deleteFlowStep({
                    ...form,
                    CSTEPNO: no,
                });
            }
        } catch (error) {
            throw new Error('Delete flow step Failed: ' + error.message);
        }
    }

    async moveFiles(
        files: Express.Multer.File[],
        form: FormDto,
        path: string,
        userCreate: string,
    ) {
        // 5. ย้ายไฟล์ไปยังปลายทาง
        const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ
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
                FILE_USERCREATE: userCreate,
                FILE_PATH: destination, // โฟลเดอร์ปลายทาง
            });
        }
        return movedTargets; // คืนรายชื่อไฟล์ที่ย้ายสำเร็จ (ถ้าต้องการ)
    }
}
