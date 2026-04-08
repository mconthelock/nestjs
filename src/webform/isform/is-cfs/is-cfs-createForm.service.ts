import { Injectable } from '@nestjs/common';
import { IsCfsService } from './is-cfs.service';
import { IsCfsRepository } from './is-cfs.repository';
import { CreateIsCfDto, InsertIsCfDto } from './dto/create-is-cf.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { SequenceOrgService } from 'src/webform/sequence-org/sequence-org.service';
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';

@Injectable()
export class IsCfsCreateFormService extends IsCfsService {
    constructor(
        protected readonly repo: IsCfsRepository,
        private readonly createFormService: FormCreateService,
        private readonly formService: FormService,
        private readonly flowService: FlowService,
        private readonly formmstService: FormmstService,
        private readonly sequenceOrgService: SequenceOrgService,
        private readonly deleteFlowStepService: DeleteFlowStepService,
    ) {
        super(repo);
    }

    async createForm(dto: CreateIsCfDto, ip: string) {
        try {
            const formmst =
                await this.formmstService.getFormMasterByVaname('IS-CFS');
            if (!formmst) {
                throw new Error('Form master not found for IS-CFS');
            }
            const devNo = dto.REQNO.split('|');
            for (const d of devNo) {
                const createForm = await this.createFormService.create(
                    {
                        NFRMNO: formmst.NNO,
                        VORGNO: formmst.VORGNO,
                        CYEAR: formmst.CYEAR,
                        REQBY: dto.REQBY,
                        INPUTBY: dto.INPUTBY,
                        DRAFT: '1',
                    },
                    ip,
                );
                if (!createForm.status) {
                    throw new Error('Create confirm sheet form Failed');
                }
                const form: FormDto = {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    CYEAR2: createForm.data.CYEAR2,
                    NRUNNO: createForm.data.NRUNNO,
                };
                const data = {
                    ...form,
                    CFS_REQUESTER: dto.REQBY,
                    CFS_REQNO: d,
                    CFS_TID_REQNO: dto.TIDFORMNO,
                };
                const createCFSForm = await this.create(data);
                if (!createCFSForm.status) {
                    throw new Error(
                        createCFSForm.message ||
                            'Insert confirm sheet data Failed',
                    );
                }
                const { step, stepDelete } = await this.setFlowStep(data);
                for (const s of step) {
                    await this.flowService.updateFlow({
                        condition: {
                            ...form,
                            CSTEPNO: s.CSTEPNO,
                        },
                        VAPVNO: s.apv,
                    });
                }

                for (const s of stepDelete) {
                    await this.deleteFlowStepService.deleteFlowStep({
                        ...form,
                        CSTEPNO: s.CSTEPNO,
                    });
                }
            }
        } catch (error) {
            throw new Error(
                `Failed to create Confirm sheet form: ${error.message}`,
            );
        }
    }

    async setFlowStep(form: InsertIsCfDto): Promise<{
        step: { CSTEPNO: string, apv?: string }[];
        stepDelete: { CSTEPNO: string }[];
    }> {
        const flowStep = [
            { CSTEPNO: '10' }, // SEM
            { CSTEPNO: '11' }, // DEM
            { CSTEPNO: '18' }, // REQUESTER IS_DEV
            { CSTEPNO: '06' }, // SEM
            { CSTEPNO: '05' }, // DDEM
            { CSTEPNO: '04' }, // DEM
        ];
        const tidStep = await this.setTIDStep(form.CFS_REQUESTER, flowStep);
        const isDevStep = await this.setDevStep(form.CFS_REQNO, tidStep);
        return await this.cleanStep(isDevStep);
    }

    async setTIDStep(
        requester: string,
        step: { CSTEPNO: string }[],
    ): Promise<{ CSTEPNO: string }[]> {
        let empno = '';
        for (let j = 0; j < 3; j++) {
            const manager = await this.getManager(j === 0 ? requester : empno);
            if (manager && manager.empno) {
                empno = manager.empno;
                step =  this.assignToApv(step, manager.position, empno, 0);
            }
        }
        return step;
    }

    /**
     * Set flow step for DEV
     * @param  reqNo Request number e.g. 'IS-DEV21-000007'
     * @param  flowStep Flow step data e.g. [ ['CSTEPNO' => '10', 'CSTEPNEXTNO' => '11'], ... ]
     * @return array
     */
    private async setDevStep(
        reqNo: string,
        step: { CSTEPNO: string }[],
    ): Promise<{ CSTEPNO: string }[]> {
        const form = await this.formService.crackRequestNo(reqNo);
        for (const f of form) {
            const requestNo = await this.formService.getRequestNo(reqNo);
            if (requestNo && requestNo.status) {
                const requester = requestNo.data[0].VREQNO ?? null;
                if (requester) {
                    step[2]['apv'] = requester;
                    let empno = '';
                    for (let j = 0; j < 3; j++) {
                        const manager = await this.getManager(
                            j === 0 ? requester : empno,
                        );
                        if (manager && manager.empno) {
                            empno = manager.empno;
                            step = this.assignToApv(
                                step,
                                manager.position,
                                empno,
                                1,
                            );
                        }
                    }
                }
            }
        }
        return step;
    }
    /**
     * Clean flow step by removing empty approval steps
     * @param array $flowStep Flow step data e.g. [ ['CSTEPNO' => '10', 'CSTEPNEXTNO' => '11'], ... ]
     * @return array
     */
    private async cleanStep(step: { CSTEPNO: string }[]): Promise<{
        step: { CSTEPNO: string }[];
        stepDelete: { CSTEPNO: string }[];
    }> {
        const stepDelete = [];
        const stepCopy = [];
        for (const [key, s] of step.entries()) {
            if (!s['apv']) {
                stepDelete.push(s);
            }else{
                stepCopy.push(s);
            }
        }
        return { step: stepCopy, stepDelete };
    }

    /**
     * Assign employee number to the flow step based on position and round
     * @param step Flow step data e.g. [{ CSTEPNO: '10' }, { CSTEPNO: '11' }, ...],
     * @param position Position of the employee e.g. 'SEM', 'DDEM', 'DEM'
     * @param empno Employee number e.g. '02035'
     * @param round Round number e.g. 0 for first round, 1 for second round
     * @return Updated flow step with assigned employee number
     * @example 
     * assignToApv(
     *   [{ CSTEPNO: '10' }, { CSTEPNO: '11' }, { CSTEPNO: '18' }, { CSTEPNO: '06' }, { CSTEPNO: '05' }, { CSTEPNO: '04' }],
     *   'SEM',
     *   '02035',
     *   0
     * ) => [
     *   { CSTEPNO: '10', apv: '02035' },
     *   { CSTEPNO: '11' },
     *   { CSTEPNO: '18' },
     *   { CSTEPNO: '06' },
     *   { CSTEPNO: '05' },
     *   { CSTEPNO: '04' }
     * ]

     */
    private assignToApv(
        step: { CSTEPNO: string }[],
        position: string,
        empno: string,
        round: number,
    ): { CSTEPNO: string }[] {
        const map: { [key: string]: (number | null)[] } = {
            SEM: [0, 3],
            DDEM: [null, 4],
            DEM: [1, 5],
        };
        if(!map[position]){
            return step;
        }
        const index = map[position][round] ?? null;
        if (index !== null) {
            step[index]['apv'] = empno;
        }
        
        return step;
    }

    /**
     * Get manager of the employee
     * @param empno Employee number e.g. '24008'
     * @return Manager details including employee number and position
     * @example
     * getManager('24008') => { empno: '02035', position: 'SEM' }
     */
    private async getManager(
        empno: string,
    ): Promise<{ empno: string; position: string }> {
        const manager = await this.sequenceOrgService.getManager(empno, [
            'HEADNO',
            'SPOSCODE1',
        ]);
        let empnoResult = '';
        let position = '';
        if (manager && manager.length > 0) {
            const mgr = manager[0];
            switch (mgr.SPOSCODE1) {
                case '30':
                    position = 'SEM';
                    empnoResult = mgr.HEADNO;
                    break;
                case '21':
                    position = 'DDEM';
                    empnoResult = mgr.HEADNO;
                    break;
                case '20':
                    position = 'DEM';
                    empnoResult = mgr.HEADNO;
                    break;
                case '11':
                    position = 'DDIM';
                    empnoResult = mgr.HEADNO;
                    break;
                case '10':
                    position = 'DIM';
                    empnoResult = mgr.HEADNO;
                    break;
                case '05':
                    position = 'GM';
                    empnoResult = mgr.HEADNO;
                    break;
                case '02':
                    position = 'PRESIDENT';
                    empnoResult = mgr.HEADNO;
                    break;
            }
        }
        const res = { empno: empnoResult, position };
        return res;
    }
}
