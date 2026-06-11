import { Injectable } from '@nestjs/common';
import { CreateFinDFormdto } from './dto/create-fin-d.dto';
import { ActionFinDDto } from './dto/action-fin-d.dto';
import { FinDsRepository } from './fin-ds.repository';
import { DS_STAMP_REPORT } from 'src/common/Entities/webform/views/FINDS_STAMP_REPORT.entity';

import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';

const JOB_CONTROLLER_CEXTDATA = ['01'];

@Injectable()
export class FinDsService {
    constructor(
        private readonly repo: FinDsRepository,
        private readonly FormmstService: FormmstService,
        private readonly FormCreateService: FormCreateService,
        private readonly handleFileFormService: HandleFileFormService,
        private readonly doactionFlowService: DoactionFlowService,
    ) {}

    findAll() {
        return this.repo.findall();
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


            const detailData =
                typeof createFinDDto.DATA === 'string'
                    ? JSON.parse(createFinDDto.DATA || '[]')
                    : createFinDDto.DATA;

            if (!Array.isArray(detailData) || detailData.length === 0) {
                throw new Error('FIN-DS detail data is required');
            }

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
