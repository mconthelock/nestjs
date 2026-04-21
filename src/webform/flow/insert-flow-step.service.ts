import { Injectable } from '@nestjs/common';
import { FlowService } from './flow.service';
import { FormDto } from '../form/dto/form.dto';
import { FlowRepository } from './flow.repository';
import { RepService } from '../rep/rep.service';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';
import { FlowmstService } from '../flowmst/flowmst.service';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
import { UsersService } from 'src/amec/users/users.service';
import { DeleteFlowStepService } from './delete-flow-step.service';
import { OrgTreeService } from '../org-tree/org-tree.service';
import { OrgposService } from '../orgpos/orgpos.service';
import { insertFlowDto } from './dto/insert-flow-step.dto';

@Injectable()
export class InsertFlowStepService extends FlowService {
    constructor(
        protected readonly repService: RepService,
        protected readonly repo: FlowRepository,
        private readonly flowmstService: FlowmstService,
        private readonly usersService: UsersService,
        private readonly deleteFlowStepService: DeleteFlowStepService,
        private readonly orgTreeService: OrgTreeService,
        private readonly orgPosService: OrgposService,
    ) {
        super(repService, repo);
    }

     // ----- type = 1
    // "CTYPE": "1",
    // "BEFORESTEPNO": "04",
    // "NEWSTEPNO": "90",
    // "POSNO": "21"
    // ----- type = 2
    // "CTYPE": "2"
    // "BEFORESTEPNO": "04",
    // "NEWSTEPNO": "78",
    // "POSNO": "30",
    // "APVORGNO": "050604",
    // ----- type = 3
    // "CTYPE": "3",
    // "BEFORESTEPNO": "40",
    // "NEWSTEPNO": "93",
    // "APVNO": "24008"
    async insertFlowStep(dto: insertFlowDto) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const { NEWSTEPNO, APVNO, BEFORESTEPNO, POSNO, APVORGNO, CTYPE } =
                dto;
            const flowmst = await this.flowmstService.getFlowMaster(
                form.NFRMNO,
                form.VORGNO,
                form.CYEAR,
            );
            const flows = await this.getFlow(form);
            // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
            // 1. ตรวจสอบว่า step ใหม่มีเลขซ้ำกับ step ที่มีอยู่หรือไม่
            const duplicateStep = flows.find(
                (f: FLOW) => f.CSTEPNO === NEWSTEPNO,
            );
            if (duplicateStep) {
                throw new Error(
                    `Step number ${NEWSTEPNO} already exists in flow`,
                );
            }
            // 2. ตรวจสอบว่า step แรกมีอยู่จริงหรือไม่
            const startStep = flows.find((f: FLOW) => f.CSTART === '1');
            if (!startStep) {
                throw new Error('Start step not found in flow');
            }
            // 2.1 หาตำแหน่งและแผนกของ step แรก
            const { empPosition, empOrg } = await this.setOrganize(
                startStep.VAPVNO,
            );

            // 3. ตรวจสอบว่ามี step ก่อนหน้าที่ระบุไว้หรือไม่
            const beforeStep = flows.find(
                (f: FLOW) => f.CSTEPNO === BEFORESTEPNO,
            );
            if (!beforeStep) {
                throw new Error('Before step not found in flow master');
            }
            const CSTEPNEXTNO = beforeStep.CSTEPNEXTNO;

            // 4. ตรวจสอบว่ามี step ใหม่อยู่ใน flow master หรือไม่
            const ckNewStep = flowmst.find(
                (f: FLOWMST) => f.CSTEPNO === NEWSTEPNO,
            );
            let data: any;
            if (!ckNewStep) {
                data = {
                    ...beforeStep,
                    CSTEPST: '1',
                    CSTEPNO: NEWSTEPNO,
                    CSTEPNEXTNO: CSTEPNEXTNO,
                    CTYPE: CTYPE,
                    VPOSNO: CTYPE === '2' || CTYPE === '1' ? POSNO : null,
                    VAPVORGNO: CTYPE === '2' ? APVORGNO : null,
                };
                // ตรวจสอบความถูกต้องของข้อมูลเพิ่มเติมตาม CTYPE
                // - CTYPE 1 ต้องมี POSNO
                // - CTYPE 2 ต้องมี POSNO และ APVORGNO
                // - CTYPE 3 ต้องมี APVNO
                if (CTYPE === '1' && !data.VPOSNO) {
                    throw new Error('POSNO is required for CTYPE 1');
                }
                if (CTYPE === '2' && (!data.VPOSNO || !data.VAPVORGNO)) {
                    throw new Error(
                        'POSNO and APVORGNO are required for CTYPE 2',
                    );
                }
                if (CTYPE === '3') {
                    if (!APVNO) {
                        throw new Error('APVNO is required for CTYPE 3');
                    }
                    data.VAPVNO = APVNO;
                }
            } else {
                data = ckNewStep;
                data.CSTEPNEXTNO = CSTEPNEXTNO;
                if (data.CTYPE === '3' && data.VAPVNO == 'SYSTEM' && APVNO) {
                    data.VAPVNO = APVNO;
                }
            }

            switch (CTYPE) {
                case '1':
                    await this.addFlow1(
                        form,
                        data,
                        empPosition,
                        empOrg,
                        startStep.VAPVNO,
                    );
                    break;
                case '2':
                    await this.addFlow2(form, data);
                    break;
                case '3':
                    data.VAPVNO = APVNO;
                    const flow = await this.setFlow(form, data);
                    await this.insertFlow(flow);
                    break;
                default:
                    break;
            }
            // อัปเดต flow step ที่มีอยู่ให้ชี้ไปยัง step ใหม่
            await this.updateFlow({
                condition: {
                    ...form,
                    CSTEPNO: BEFORESTEPNO,
                },
                CSTEPNEXTNO: NEWSTEPNO,
            });
            // ลบ flow step ที่ไม่ใช้แล้ว (ถ้ามี)
            const notuse = await this.getFlow({
                ...form,
                CSTEPST: '0',
            });
            for (const row of notuse) {
                const deleteResult =
                    await this.deleteFlowStepService.deleteFlowStep(row);
                if (!deleteResult.status) {
                    throw new Error(deleteResult.message);
                }
            }
            // รีเซ็ต flow เพื่อให้สถานะถูกต้องตามลำดับขั้นตอนใหม่
            await this.resetFlow(form);
            return {
                status: true,
                message: 'Insert flow step success',
                flow: await this.getFlowTree(form),
            }
        } catch (error) {
            throw new Error('Set Flow Step Error: ' + error.message);
        }
    }

    private async setFlow(form: FormDto, data: any) {
        const represent = await this.repService.getRepresent({
            NFRMNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
            VEMPNO: data.VAPVNO,
        });
        return {
            NFRMNO: form.NFRMNO,
            VORGNO: form.VORGNO,
            CYEAR: form.CYEAR,
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
            CSTEPNO: data.CSTEPNO,
            CSTEPNEXTNO: data.CSTEPNEXTNO,
            CSTEPST: data.CSTEPST || '1',
            CSTART: '0',
            VPOSNO: data.VPOSNO,
            VAPVNO: data.VAPVNO,
            VREPNO: represent,
            CAPVSTNO: '0',
            CTYPE: data.CTYPE,
            VURL: data.VURL,
            CEXTDATA: data.CEXTDATA,
            CAPVTYPE: data.CAPVTYPE,
            CREJTYPE: data.CREJTYPE,
            CAPPLYALL: data.CAPPLYALL,
        };
    }

    private async setOrganize(empno: string) {
        const user = await this.usersService.findEmp(empno);
        let emppos = user.SPOSCODE;
        let orgno: string;
        if (user.SSECCODE == '00') {
            if (user.SDEPCODE == '00') {
                orgno = user.SDIVCODE;
            } else {
                orgno = user.SDEPCODE;
            }
        } else {
            orgno = user.SSECCODE;
        }
        return { empPosition: emppos, empOrg: orgno };
    }

    private async addFlow1(
        form: FormDto,
        data: any,
        empPosition: string,
        empOrg: string,
        empApprove: string,
    ) {
        const orgTree = await this.orgTreeService.getOrgTree(
            empOrg,
            data.VPOSNO,
            empApprove,
            empPosition,
        );

        if (orgTree) {
            for (const row of orgTree) {
                const flow = await this.setFlow(form, {
                    ...data,
                    VAPVNO: row.VEMPNO,
                });
                await this.insertFlow(flow);
            }
        } else {
            const flow = await this.setFlow(form, {
                ...data,
                VAPVNO: empApprove,
                CSTEPST: '0',
            });
            await this.insertFlow(flow);
        }
    }

    private async addFlow2(form: FormDto, data: any) {
        const val = await this.orgPosService.getOrgPos({
            VPOSNO: data.VPOSNO,
            VORGNO: data.VAPVORGNO,
        });
        if (val.length > 0) {
            for (const row of val) {
                const flow = await this.setFlow(form, {
                    ...data,
                    VAPVNO: row.VEMPNO,
                });
                await this.insertFlow(flow);
            }
        } else {
            const flow = await this.setFlow(form, {
                ...data,
                VAPVNO: data.VAPVNO,
                CSTEPST: '0',
            });
            await this.insertFlow(flow);
        }
    }
}
