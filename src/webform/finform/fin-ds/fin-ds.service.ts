import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFinDFormdto } from './dto/create-fin-d.dto';
import { ActionFinDDto } from './dto/action-fin-d.dto';
import { FinDsRepository } from './fin-ds.repository';
import { DS_STAMP_REPORT } from 'src/common/Entities/webform/views/FINDS_STAMP_REPORT.entity';

import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { FlowService } from 'src/webform/flow/flow.service';

const JOB_CONTROLLER_CEXTDATA = ['01'];

export function calculateDutyBalances(
    reportRows: Record<string, unknown>[],
    dutyValues: number[],
) {
    return dutyValues.map((dutyValue) => {
        const key = String(Number(dutyValue));
        const balance = reportRows.reduce((total, row) => {
            const buy = Number(row[`BUY_${key}_QTY`]) || 0;
            const withdraw = Number(row[`WD_${key}_QTY`]) || 0;

            return total + buy - withdraw;
        }, 0);

        return { DUTY_VALUE: Number(dutyValue), BAL_QTY: balance };
    });
}

@Injectable()
export class FinDsService {
    constructor(
        private readonly repo: FinDsRepository,
        private readonly FormmstService: FormmstService,
        private readonly FormCreateService: FormCreateService,
        private readonly handleFileFormService: HandleFileFormService,
        private readonly doactionFlowService: DoactionFlowService,
        private readonly deleteflowservice: DeleteFlowStepService,
        private readonly flowservice: FlowService,
    ) {}

    findAll() {
        return this.repo.findall();
    }

    async findBalance(fyear: number) {
        if (!Number.isInteger(fyear) || fyear < 1900 || fyear > 2100) {
            throw new BadRequestException('Invalid fiscal year');
        }

        const [reportRows, stamps] = await Promise.all([
            this.repo.findReport(fyear),
            this.repo.findall(),
        ]);

        return {
            status: true,
            data: calculateDutyBalances(
                reportRows,
                stamps.map((stamp) => Number(stamp.DUTY_VALUE)),
            ),
        };
    }

    async findAllHeadForShow() {
        const data = await this.repo.findAllHead();

        return {
            status: true,
            message: 'Get FIN-DS head success',
            data,
        };
    }

    async findOneForShow(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        const data = await this.repo.findOneForShow(
            nfrmno,
            vorgno,
            cyear,
            cyear2,
            nrunno,
        );

        if (!data.head) {
            return {
                status: false,
                message: 'FIN-DS data not found',
                data: null,
            };
        }

        return {
            status: true,
            message: 'Get FIN-DS data success',
            data,
        };
    }
    async findFileById(fileId: number) {
        return this.repo.findFileById(fileId);
    }

    async action(dto: ActionFinDDto, ip: string) {

        const form = {
            NFRMNO: Number(dto.NFRMNO),
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2 || dto.CYEAR,
            NRUNNO: Number(dto.NRUNNO),
        };

        const doAction = await this.doactionFlowService.doAction(
            {
                ...dto,
                ...form,
            },
            ip,
        );

        if (!doAction.status) {
            throw new Error(doAction.message);
        }

        const isJobController = this.isJobControllerCextData(dto.CEXTDATA);


        if (dto.ACTION === 'approve' && isJobController) {
            const dateReceive = this.normalizeDateReceive(dto.DATE_RECEIVE);

            if (!dateReceive) {
                throw new Error('DATE_RECEIVE is required');
            }

            const updateResult = await this.repo.updateDateReceive(
                form,
                dateReceive,
            );

            if (!updateResult.affected) {
                throw new Error(
                    'FIN-DS head not found for DATE_RECEIVE update',
                );
            }
        }

        return {
            status: true,
            message: doAction.message || 'FIN-DS action success',
        };
    }

    private isJobControllerCextData(cextData?: string) {
        return JOB_CONTROLLER_CEXTDATA.includes(String(cextData || '').trim());
    }

    private normalizeDateReceive(value?: Date | string) {
        if (!value) return null;

        if (value instanceof Date) {
            if (Number.isNaN(value.getTime())) return null;

            return value.toISOString().substring(0, 10);
        }

        const text = String(value).trim();

        if (!text) return null;

        const dateText = text.substring(0, 10);

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
            return dateText;
        }

        const date = new Date(text);

        return Number.isNaN(date.getTime())
            ? null
            : date.toISOString().substring(0, 10);
    }

    async create(
        createFinDDto: CreateFinDFormdto,
        files: Express.Multer.File[],
        ip: string,
    ) {
        try {

            const detailData =
                typeof createFinDDto.DATA === 'string'
                    ? JSON.parse(createFinDDto.DATA || '[]')
                    : createFinDDto.DATA;

            if (!Array.isArray(detailData) || detailData.length === 0) {
                throw new BadRequestException('FIN-DS detail data is required');
            }

            const requestedByDuty = new Map<number, number>();

            for (const detail of detailData) {
                const dutyValue = Number(detail.DUTY_VALUE);
                const qty = Number(detail.QTY);

                if (!Number.isFinite(dutyValue) || !Number.isFinite(qty) || qty <= 0) {
                    throw new BadRequestException('Invalid duty stamp quantity');
                }

                requestedByDuty.set(
                    dutyValue,
                    (requestedByDuty.get(dutyValue) || 0) + qty,
                );
            }

            if (createFinDDto.OPTION_CODE === '0') {
                // ponytail: report snapshot can race; lock the real stock row once FINDS_STOCK is confirmed.
                const balance = await this.findBalance(new Date().getFullYear());
                const availableByDuty = new Map(
                    balance.data.map((item) => [item.DUTY_VALUE, item.BAL_QTY]),
                );

                for (const [dutyValue, requested] of requestedByDuty) {
                    const available = Math.max(
                        0,
                        availableByDuty.get(dutyValue) || 0,
                    );

                    if (requested > available) {
                        throw new BadRequestException(
                            `Duty stamp ${dutyValue} Baht has only ${available} remaining (requested ${requested})`,
                        );
                    }
                }
            }

            const formmst =
                await this.FormmstService.getFormMasterByVaname('FIN-DS');


            const createForm = await this.FormCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: createFinDDto.REQBY,
                    INPUTBY: createFinDDto.INPUTBY,
                    REMARK: createFinDDto.REMARK,
                },
                ip,
            );

            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2 || createForm.data.CYEAR,
                NRUNNO: createForm.data.NRUNNO,
            };
            if (createFinDDto.OPTION_CODE === "1"){
                for (const step of ['05','04','03','02','06']) {
                    await this.deleteflowservice.deleteFlowStep({
                        ...form,
                        CSTEPNO: step,
                    })
                }
                await  this.flowservice.updateFlow({
                     condition: {
                        ...form,
                        CEXTDATA: '01',
                    },
                    CSTEPST: '3',
                    VAPVNO: "92077"
                });
            }

            const headData = {
                ...form,
                OPTION_CODE: createFinDDto.OPTION_CODE,
                EFFECTIVE_DATE: createFinDDto.EFFECTIVE_DATE,
                LOCATION: createFinDDto.LOCATION,
            };

            if (createFinDDto.DATE_RECEIVE) {
                headData['DATE_RECEIVE'] = createFinDDto.DATE_RECEIVE;
            }

            const head = await this.repo.createHead(headData);


            for (const DetailDATA of detailData) {
                const lineId = Number(DetailDATA.LINE_ID ?? DetailDATA.LINEID);

                if (!lineId || Number.isNaN(lineId)) {
                    throw new Error(
                        `LINEID is required: ${JSON.stringify(DetailDATA)}`,
                    );
                }

                await this.repo.createdetail({
                    ...form,
                    LINEID: lineId,
                    REASON: DetailDATA.REASON,
                    DUTY_VALUE: Number(DetailDATA.DUTY_VALUE),
                    QTY: Number(DetailDATA.QTY),
                });
            }

            let fileResult = null;

            if (files && files.length > 0) {
                fileResult = await this.handleFileFormService.insertFiles(
                    {
                        NFRMNO: form.NFRMNO,
                        VORGNO: form.VORGNO,
                        CYEAR: form.CYEAR,
                        CYEAR2: form.CYEAR2,
                        NRUNNO: form.NRUNNO,

                        FORM_TYPE: 'FIN',
                        CREATEBY: createFinDDto.INPUTBY,
                    },
                    files,
                );

                if (!fileResult.status) {
                    throw new Error(fileResult.message);
                }
            }

            return {
                status: true,
                message: 'Create FIN-DS success',
                data: {
                    form,
                    head,
                    files: fileResult,
                },
            };
        } catch (error) {
            console.error('Error creating FinD form:', error);
            throw error;
        }
    }
    async findForShowReport(FYEAR: number) {
    const datareport = await this.repo.findReport(FYEAR);

    return {
        status: true,
        message: 'Get FIN-DS report success',
        datareport,
    };
}






}
