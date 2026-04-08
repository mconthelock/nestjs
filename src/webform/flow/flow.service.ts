import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { SearchFlowDto } from './dto/search-flow.dto';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { empnoFormDto } from '../form/dto/empno-form.dto';
import { FormDto } from '../form/dto/form.dto';

import { RepService } from '../rep/rep.service';
import { FlowRepository } from './flow.repository';

@Injectable()
export class FlowService {
    constructor(
        protected readonly repService: RepService,
        protected readonly repo: FlowRepository,
    ) {}

    protected readonly APV_TYPE_SINGLE = '1';
    protected readonly APV_TYPE_MULTIPLE_CAN = '2';
    protected readonly APV_TYPE_MULTIPLE_CO = '3';
    protected readonly APV_TYPE_MULTIPLE = '3';
    protected readonly APPLY_ALL_NONE = '0';
    protected readonly APPLY_ALL_APV = '1';
    protected readonly APPLY_ALL_REJ = '2';
    protected readonly APPLY_ALL_BOTH = '3';
    protected readonly APV_NONE = '0';
    protected readonly APV_APPROVE = '1';
    protected readonly APV_REJECT = '2';
    protected readonly APV_UNKNOWN = '3';
    protected readonly APV_RETURN = '4';
    protected readonly STEP_NOT_USE = '0';
    protected readonly STEP_USE = '1';
    protected readonly STEP_NORMAL = '1';
    protected readonly STEP_WAIT = '2';
    protected readonly STEP_READY = '3';
    protected readonly STEP_PASS = '4';
    protected readonly STEP_APPROVE = '5';
    protected readonly STEP_REJECT = '6';
    protected readonly STEP_SKIP = '7';
    protected readonly STEP_DIE = '8';
    protected readonly STEP_RETURN = '9';
    protected readonly FLOW_PREPARE = '0';
    protected readonly FLOW_ON_GOING = '1';
    protected readonly FLOW_RUNNING = '1';
    protected readonly FLOW_APPROVE = '2';
    protected readonly FLOW_REJECT = '3';

    async insertFlow(dto: CreateFlowDto) : Promise<boolean> {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return false;
            }
            return true;
        } catch (error) {
            throw new Error('Insert flow Error: ' + error.message);
        }
    }

    getFlow(dto: SearchFlowDto) {
        return this.repo.getFlow(dto);
    }

    async getFlowTree(form: FormDto) {
        return await this.repo.getFlowTree(form);
    }

    async updateFlow(dto: UpdateFlowDto) {
        try {
            const { condition, ...data } = dto;
            if (data.VAPVNO && !data.VREPNO) {
                data.VREPNO = await this.repService.getRepresent({
                    NFRMNO: condition.NFRMNO,
                    VORGNO: condition.VORGNO,
                    CYEAR: condition.CYEAR,
                    VEMPNO: data.VAPVNO,
                });
            }
            const res = await this.repo.update(condition, data);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Update flow Failed`,
                };
            }
            return {
                status: true,
                message: `Update flow Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error('Update flow Error: ' + error.message);
        }
    }

    async deleteFlow(dto: UpdateFlowDto) {
        try {
            const res = await this.repo.delete(dto);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Delete flow Failed`,
                };
            }
            return {
                status: true,
                message: `Delete flow Successfully`,
                data: res,
            };
        } catch (error) {
            throw new Error('Delete flow Error: ' + error.message);
        }
    }

    async reAlignFlow(
        dto: UpdateFlowDto,
    ): Promise<{ message: string; status: boolean }> {
        try {
            const res = await this.repo.reAlignFlow(dto);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: `Re-align flow Failed`,
                };
            }
            return {
                status: true,
                message: `Re-align flow Successfully`,
            };
        } catch (error) {
            throw new Error('Re-align flow Error: ' + error.message);
        }
    }

    async getEmpFlowStepReady(form: empnoFormDto) {
        return await this.repo.getEmpFlowStepReady(form);
    }

    async checkReturn(form: empnoFormDto) : Promise<boolean> {
        const res = await this.repo.checkReturn(form);
        return res.length > 0;
    }

    async checkReturnb(dto: empnoFormDto) : Promise<boolean> {
        const res = await this.repo.checkReturnb(dto);
        return res.length > 0;
    }

    async getExtData(dto: empnoFormDto): Promise<string> {
        const flow = await this.getEmpFlowStepReady(dto);
        if (flow.length === 0 || dto.EMPNO == null || dto.EMPNO == '') {
            return '';
        }
        return flow[0].CEXTDATA;
    }
    //------------------------------ Reset flow Start ------------------------------

    async resetFlow(form: FormDto) {
        try {
            const flowtree = await this.getFlowTree(form);

            if (flowtree.length === 0) {
                throw new Error('Flow data not found');
            }

            let updated = true;
            while (updated) {
                updated = false;
                const flowtree = await this.getFlowTree(form);
                for (let i = 0; i < flowtree.length - 1; i++) {
                    const currStep = flowtree[i];
                    const nextStep = flowtree[i + 1];
                    // STEP_APPROVE = '5', STEP_READY = '3', STEP_REJECT = '6', STEP_SKIP = '7', STEP_NORMAL = '1', STEP_WAIT = '2'
                    if (
                        currStep.CSTEPST == this.STEP_APPROVE &&
                        nextStep.CSTEPST != this.STEP_READY &&
                        nextStep.CSTEPST != this.STEP_REJECT &&
                        nextStep.CSTEPST != this.STEP_SKIP &&
                        nextStep.CSTEPST != this.STEP_APPROVE
                    ) {
                        await this.updateFlow({
                            condition: {
                                NFRMNO: form.NFRMNO,
                                VORGNO: form.VORGNO,
                                CYEAR: form.CYEAR,
                                CYEAR2: form.CYEAR2,
                                NRUNNO: form.NRUNNO,
                                CSTEPNO: nextStep.CSTEPNO,
                            },
                            CSTEPST: this.STEP_READY,
                        });
                        updated = true;
                    }
                    if (
                        currStep.CSTEPST == this.STEP_READY &&
                        nextStep.CSTEPST != this.STEP_WAIT &&
                        nextStep.CSTEPST != this.STEP_REJECT &&
                        nextStep.CSTEPST != this.STEP_SKIP &&
                        nextStep.CSTEPST != this.STEP_APPROVE
                    ) {
                        await this.updateFlow({
                            condition: {
                                NFRMNO: form.NFRMNO,
                                VORGNO: form.VORGNO,
                                CYEAR: form.CYEAR,
                                CYEAR2: form.CYEAR2,
                                NRUNNO: form.NRUNNO,
                                CSTEPNO: nextStep.CSTEPNO,
                            },
                            CSTEPST: this.STEP_WAIT,
                        });
                        updated = true;
                    }
                    if (
                        currStep.CSTEPST == this.STEP_WAIT &&
                        nextStep.CSTEPST != this.STEP_NORMAL &&
                        nextStep.CSTEPST != this.STEP_REJECT &&
                        nextStep.CSTEPST != this.STEP_SKIP &&
                        nextStep.CSTEPST != this.STEP_APPROVE
                    ) {
                        await this.updateFlow({
                            condition: {
                                NFRMNO: form.NFRMNO,
                                VORGNO: form.VORGNO,
                                CYEAR: form.CYEAR,
                                CYEAR2: form.CYEAR2,
                                NRUNNO: form.NRUNNO,
                                CSTEPNO: nextStep.CSTEPNO,
                            },
                            CSTEPST: this.STEP_NORMAL,
                        });
                        updated = true;
                    }
                    if (
                        currStep.CSTEPST == this.STEP_NORMAL &&
                        nextStep.CSTEPST != this.STEP_NORMAL &&
                        nextStep.CSTEPST != this.STEP_REJECT &&
                        nextStep.CSTEPST != this.STEP_SKIP &&
                        nextStep.CSTEPST != this.STEP_APPROVE
                    ) {
                        await this.updateFlow({
                            condition: {
                                NFRMNO: form.NFRMNO,
                                VORGNO: form.VORGNO,
                                CYEAR: form.CYEAR,
                                CYEAR2: form.CYEAR2,
                                NRUNNO: form.NRUNNO,
                                CSTEPNO: nextStep.CSTEPNO,
                            },
                            CSTEPST: this.STEP_NORMAL,
                        });
                        updated = true;
                    }
                }
            }
            return {
                status: true,
                message: 'Reset flow Successfully',
                data: await this.getFlowTree(form),
            };
        } catch (error) {
            throw new Error('Reset flow Error: ' + error.message);
        }
    }

    // ------------------------------ Reset flow End ------------------------------
}
