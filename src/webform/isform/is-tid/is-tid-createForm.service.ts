import { Injectable } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import {
    CreateIsTidDto,
    CreateIsTidFormDto,
    IsTidUserData,
} from './dto/create-is-tid.dto';
import { FormService } from 'src/webform/form/form.service';
import { IsTidRepository } from './is-tid.repository';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { SequenceOrgService } from 'src/webform/sequence-org/sequence-org.service';
import { FlowService } from 'src/webform/flow/flow.service';
import {
    CreateFormDto,
    FormWebformDto,
} from 'src/webform/form/dto/create-form.dto';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { formatDate, now } from 'src/common/utils/dayjs.utils';
import { IsCfsCreateFormService } from '../is-cfs/is-cfs-createForm.service';

@Injectable()
export class IsTidCreateFormService extends IsTidService {
    constructor(
        protected readonly repo: IsTidRepository,
        private readonly formService: FormService,
        private readonly createFormService: FormCreateService,
        private readonly sequenceOrgService: SequenceOrgService,
        private readonly flowService: FlowService,
        private readonly deleteFlowStepService: DeleteFlowStepService,
        private readonly doactionFlowService: DoactionFlowService,
        private readonly isCfsCreateFormService: IsCfsCreateFormService,
    ) {
        super(repo);
    }

    async handleCreate(dto: CreateIsTidFormDto, ip: string) {
        try {
            const formType = dto.FORMTYPE;
            const changeData = dto.CHANGEDATA;
            // Create form without controller
            if (formType == 1) {
                const formRes = await this.createForm(dto, ip, dto.USERDATA);
                const step = await this.getUpdateFlowStep(formRes.requester);
                await this.deleteFlowStep(formRes.FORM);
                await this.updateFlowStep(step, formRes.FORM);
                await this.autoApprove(formRes.FORM, step, ip);
            }

            // Create form with controller if formType is 2
            let tidFormNo: string;
            if (formType == 2) {
                const formUser = await this.createForm(dto, ip, dto.USERDATA);
                const stepUser = await this.getUpdateFlowStep(
                    formUser.requester,
                );
                stepUser.push(
                    { CSTEPNO: '19', apv: dto.CONTROLLERDATA.TID_REQUESTER },
                    { CSTEPNO: '08', apv: dto.CONTROLLERDATA.TID_REQUESTER },
                );
                await this.updateFlowStep(stepUser, formUser.FORM);
                await this.autoApprove(formUser.FORM, stepUser, ip);

                tidFormNo = await this.formService.getFormno(formUser.FORM);
                const formControl = await this.createForm(dto, ip, {
                    ...dto.CONTROLLERDATA,
                    TID_REQNO: tidFormNo,
                });
                const stepControl = await this.getUpdateFlowStep(
                    formControl.requester,
                );
                await this.deleteFlowStep(formControl.FORM);
                await this.updateFlowStep(stepControl, formControl.FORM);
                await this.autoApprove(formControl.FORM, stepControl, ip);
            }

            if (changeData) {
                await this.isCfsCreateFormService.createForm(
                    {
                        INPUTBY: dto.INPUTBY,
                        REQBY: dto.REQBY,
                        REQNO: dto.USERDATA.TID_REQNO,
                        TIDFORMNO: tidFormNo,
                    },
                    ip,
                );
            }
            // throw new Error('Test error handling in createForm'); // ทดสอบการจับ error
            return {
                status: true,
                message:
                    'Create Production Environment ID temporary use request successfully',
            };
        } catch (error) {
            throw new Error(
                'Create Production Environment ID temporary use request Failed: ' +
                    error.message,
            );
        }
    }

    setFormValue(dto: CreateIsTidFormDto, formData: FormWebformDto) {
        return {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: formData.CYEAR2,
            NRUNNO: formData.NRUNNO,
        };
    }

    async createForm(dto: CreateIsTidFormDto, ip: string, data: IsTidUserData) {
        try {
            const dataForCreateForm: CreateFormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                REQBY: data.TID_REQUESTER,
                INPUTBY: dto.INPUTBY,
                REMARK: dto.REMARK,
            };
            const createForm = await this.createFormService.create(
                dataForCreateForm,
                ip,
            );
            if (!createForm.status) {
                throw new Error('Create form Failed');
            }
            const form: FormDto = this.setFormValue(dto, createForm.data);
            const createTidForm = await this.create({
                ...form,
                ...data,
            });
            if (!createTidForm.status) {
                throw new Error(
                    createTidForm.message || 'Insert user data Failed',
                );
            }
            return { FORM: form, requester: data.TID_REQUESTER };
        } catch (error) {
            throw new Error('Create form Failed: ' + error.message);
        }
    }

    async getUpdateFlowStep(requester: string) {
        const managerRes = await this.sequenceOrgService.getManager(requester);
        if (!managerRes || managerRes.length === 0) {
            throw new Error(`Manager not found for requester ${requester}`);
        }
        const manager = managerRes[0].HEADNO;
        return [
            { CSTEPNO: '06', apv: manager },
            { CSTEPNO: '28', apv: requester },
            { CSTEPNO: '10', apv: manager },
        ];
    }

    async updateFlowStep(
        step: { CSTEPNO: string; apv: string }[],
        form: FormDto,
    ) {
        try {
            for (const s of step) {
                const update = await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: s.CSTEPNO,
                    },
                    VAPVNO: s.apv,
                });
                // if (!update.status) {
                //     throw new Error(
                //         update.message ||
                //             `Update flow step ${s.CSTEPNO} Failed`,
                //     );
                // }
            }
        } catch (error) {
            throw new Error('Update flow step Failed: ' + error.message);
        }
    }

    async deleteFlowStep(form: FormDto) {
        try {
            const deleteStep = ['19', '08', '04'];
            for (const stepNo of deleteStep) {
                const deleteRes =
                    await this.deleteFlowStepService.deleteFlowStep({
                        ...form,
                        CSTEPNO: stepNo,
                    });
                if (!deleteRes.status) {
                    throw new Error(
                        deleteRes.message ||
                            `Delete flow step ${stepNo} Failed`,
                    );
                }
            }
        } catch (error) {
            throw new Error('Delete flow step Failed: ' + error.message);
        }
    }

    async autoApprove(
        form: FormDto,
        step: { CSTEPNO: string; apv: string }[],
        ip: string,
    ) {
        try {
            step = step.filter((s) => s.CSTEPNO === '06' || s.CSTEPNO === '19'); // อนุมัติแค่ step 06
            let ms = 60000;
            for (const s of step) {
                console.log(s);

                await this.doactionFlowService.doAction(
                    {
                        ...form,
                        ACTION: 'approve',
                        EMPNO: s.apv,
                    },
                    ip,
                );
                await this.flowService.updateFlow({
                    condition: {
                        ...form,
                        CSTEPNO: s.CSTEPNO,
                        VREALAPV: s.apv,
                    },
                    CAPVTIME: formatDate(
                        new Date(Date.now() + ms),
                        'HH:mm:ss',
                    ), // ตั้งเวลาอนุมัติเป็น 1 นาทีข้างหน้าเพื่อหลีกเลี่ยงปัญหาเวลาที่อาจเกิดขึ้น
                });
                ms+= 60000; // เพิ่มเวลาให้แต่ละ step ถัดไปอีก 1 นาทีเพื่อให้แน่ใจว่าเวลาที่ตั้งไว้ไม่ซ้ำกันและเพียงพอสำหรับการประมวลผลแต่ละ step
            }
        } catch (error) {
            throw new Error('Auto approve Failed: ' + error.message);
        }
    }
}
