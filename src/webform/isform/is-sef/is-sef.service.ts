import { Injectable } from '@nestjs/common';
import { CreateIsSefDto } from './dto/create-is-sef.dto';
import { CreateIsSefEmptyDto } from './dto/create-is-sef-empty.dto';
import { UpdateIsSefDto } from './dto/update-is-sef.dto';
import { FormmstService } from 'src/webform/center/formmst/formmst.service';
import { FormCreateService } from 'src/webform/center/form/create-form.service';
import { IsSefRepository } from './is-sef.repository';
import { WorkPlan } from 'src/common/Entities/docinv/table/work-plan.entity';

@Injectable()
export class IsSefService {
    constructor(
        private readonly isSefRepo: IsSefRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
    ) {}

    async insertForm(data: CreateIsSefDto, ip) {
        const formmst =
            await this.formmstService.getFormMasterByVaname('IS-SEF');
        if (!formmst) {
            throw new Error(
                'Form master not found for IS-SEF. Check FORMMST table.',
            );
        }
        const createForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: data.REQBY,
                INPUTBY: data.INPUTBY,
                REMARK: data.REMARK,
            },
            ip,
        );

        if (!createForm?.status) {
            const errMsg =
                createForm?.message?.message ||
                createForm?.message ||
                'Unknown error';
            throw new Error(`Form creation failed: ${errMsg}`);
        }

        const sessionData = {
            NFRMNO: createForm.data.NFRMNO,
            VORGNO: createForm.data.VORGNO,
            CYEAR: createForm.data.CYEAR,
            CYEAR2: createForm.data.CYEAR2,
            NRUNNO: createForm.data.NRUNNO,
            PROJECT_ID: data.PROJECT_ID ?? null,
            EVAPRO_AVG: data.PRO_AVG,
            EVAAPP_AVG: data.APP_AVG,
            OVERALL_AVG: data.OVERALL_AVG,
            OVERALL_LEVEL: String(data.LEVEL),
            COMMENTS: data.COMMENT,
        };

        const scoreData = Object.entries(data.SCORE).map(([evaId, score]) => ({
            NFRMNO: createForm.data.NFRMNO,
            VORGNO: createForm.data.VORGNO,
            CYEAR: createForm.data.CYEAR,
            CYEAR2: createForm.data.CYEAR2,
            NRUNNO: createForm.data.NRUNNO,
            EVA_ID: Number(evaId),
            SCORE: String(score),
        }));

        console.log(sessionData);
        console.log(scoreData);

        await this.isSefRepo.saveSession(sessionData);
        await this.isSefRepo.saveScores(scoreData);

        return {
            status: true,
            message: 'success',
            sessionData,
            scoreData,
        };
    }

    async insertEmptyForm(data: CreateIsSefEmptyDto, ip) {
        try {
            const formmst =
                await this.formmstService.getFormMasterByVaname('IS-SEF');
            if (!formmst) {
                throw new Error(
                    'Form master not found for IS-SEF. Check FORMMST table.',
                );
            }
            const createForm = await this.formCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: data.REQBY,
                    INPUTBY: data.INPUTBY,
                    REMARK: data.REMARK,
                    DRAFT: '1',
                },
                ip,
            );

            if (!createForm?.status) {
                const errMsg =
                    createForm?.message?.message ||
                    createForm?.message ||
                    'Unknown error';
                throw new Error(`Form creation failed: ${errMsg}`);
            }

            const sessionData = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
                PROJECT_ID: data.PROJECT_ID ?? null,
            };

            const getCriteria = await this.isSefRepo.getCriteria();
            const scoreData = getCriteria.map((criteria) => ({
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
                EVA_ID: criteria.EVA_ID,
                SCORE: null,
            }));

            await this.isSefRepo.saveSession(sessionData);
            await this.isSefRepo.saveScores(scoreData);

            return {
                status: true,
                message: 'success',
                sessionData,
                scoreData,
            };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Error inserting empty form',
            };
        }
    }

    async findSessionByForm(form: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
    }) {
        const { head, detail } = await this.isSefRepo.findSessionByForm(form);
        const workPlan = head?.PROJECT_ID
            ? await this.isSefRepo.getWorkPlan({ PLANID: head.PROJECT_ID })
            : null;

        return { head, detail, workPlan };
    }

    async getCriteria() {
        return this.isSefRepo.getCriteria();
    }

    async getWorkPlan(filter?: Partial<WorkPlan>) {
        return this.isSefRepo.getWorkPlan(filter);
    }

    async update(data: UpdateIsSefDto) {
        try {
            const keys = {
                NFRMNO: data.NFRMNO,
                VORGNO: data.VORGNO,
                CYEAR: data.CYEAR,
                CYEAR2: data.CYEAR2,
                NRUNNO: data.NRUNNO,
            };

            const data_session = {
                EVAPRO_AVG: data.PRO_AVG,
                EVAAPP_AVG: data.APP_AVG,
                OVERALL_AVG: data.OVERALL_AVG,
                OVERALL_LEVEL: String(data.LEVEL),
                COMMENTS: data.COMMENT,
            };

            await this.isSefRepo.updateSession(keys, data_session);

            if (data.SCORE) {
                await Promise.all(
                    Object.entries(data.SCORE).map(([evaId, score]) =>
                        this.isSefRepo.updateScore(
                            { ...keys, EVA_ID: Number(evaId) },
                            String(score),
                        ),
                    ),
                );
            }

            return { status: true, message: 'success' };
        } catch (error) {
            return {
                status: false,
                message: error.message || 'Error updating session',
            };
        }
    }
}
