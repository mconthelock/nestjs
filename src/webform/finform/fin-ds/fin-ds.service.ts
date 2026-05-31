import { Injectable } from '@nestjs/common';
import { CreateFinDFormdto } from './dto/create-fin-d.dto';
import { FinDsRepository } from './fin-ds.repository';

import { FormmstService } from 'src/webform/center/formmst/formmst.service';
import { FormCreateService } from 'src/webform/center/form/create-form.service';
import { HandleFileFormService } from 'src/webform/center/handle-file-form/handle-file-form.service';

@Injectable()
export class FinDsService {
    constructor(
        private readonly repo: FinDsRepository,
        private readonly FormmstService: FormmstService,
        private readonly FormCreateService: FormCreateService,
        private readonly handleFileFormService: HandleFileFormService,
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
        nrunno: number,
    ) {
        const data = await this.repo.findOneForShow(
            nfrmno,
            vorgno,
            cyear,
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

    async create(
        createFinDDto: CreateFinDFormdto,
        files: Express.Multer.File[],
        ip: string,
    ) {
        try {
            console.log('dto', createFinDDto);
            console.log('files', files);

            const formmst =
                await this.FormmstService.getFormMasterByVaname('FIN-DS');

            console.log('form master', formmst);

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

            console.log('createForm', createForm);

            const form = {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2 || createForm.data.CYEAR,
                NRUNNO: createForm.data.NRUNNO,
            };

            const head = await this.repo.createHead({
                ...form,
                OPTION_CODE: createFinDDto.OPTION_CODE,
                EFFECTIVE_DATE: createFinDDto.EFFECTIVE_DATE,
                DATE_RECEIVE: createFinDDto.DATE_RECEIVE,
                LOCATION: createFinDDto.LOCATION,
            });

            console.log('Created head:', head);

            console.log('RAW DATA:', createFinDDto.DATA);
            console.log('RAW DATA TYPE:', typeof createFinDDto.DATA);

            const detailData =
                typeof createFinDDto.DATA === 'string'
                    ? JSON.parse(createFinDDto.DATA || '[]')
                    : createFinDDto.DATA;

            console.log('detailData parsed:', detailData);

            if (!Array.isArray(detailData) || detailData.length === 0) {
                throw new Error('FIN-DS detail data is required');
            }

            for (const DetailDATA of detailData) {
                console.log('DetailDATA:', DetailDATA);

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
}
