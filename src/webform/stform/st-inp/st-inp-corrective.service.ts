import { Injectable } from '@nestjs/common';
import { StInpService } from './st-inp.service';
import {
    CorrectiveStInpDetailDto,
    CorrectiveStInpDto,
} from './dto/corrective-st-inp.dto';
import { FlowService } from 'src/webform/flow/flow.service';
import { StyPatrolService } from 'src/gpreport/sty-patrol/sty-patrol.service';
import { StyTypeService } from 'src/gpreport/sty-type/sty-type.service';
import { StyImageService } from 'src/gpreport/sty-image/sty-image.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FormService } from 'src/webform/form/form.service';
import { StinpFormListService } from 'src/gpreport/stinp-form-list/stinp-form-list.service';
import { StinpFormService } from 'src/gpreport/stinp-form/stinp-form.service';

@Injectable()
export class StInpCorrectiveService extends StInpService {
    constructor(
        protected readonly createFormService: FormCreateService,
        protected readonly formmstService: FormmstService,
        protected readonly styImageService: StyImageService,
        protected readonly styTypeService: StyTypeService,
        protected readonly flowService: FlowService,
        protected readonly formService: FormService,
        protected readonly stinpFormService: StinpFormService,
        protected readonly stinpFormListService: StinpFormListService,
        private readonly doactionService: DoactionFlowService,
    ) {
        super(
            createFormService,
            formmstService,
            styImageService,
            styTypeService,
            flowService,
            formService,
            stinpFormService,
            stinpFormListService,
        );
    }

    async setCorrective(dto: CorrectiveStInpDto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const update = await this.flowService.updateFlow({
                condition: {
                    ...form,
                    CEXTDATA: '02',
                },
                VAPVNO: dto.EMPCORRECTIVE,
            });
            await this.doactionService.doAction(
                {
                    ...form,
                    EMPNO: dto.EMPNO,
                    ACTION: dto.ACTION,
                    REMARK: dto.REMARK,
                },
                ip,
            );
            return {
                status: true,
                message: 'Corrective action set successfully',
            };
        } catch (error) {
            throw new Error(
                `Failed to set corrective action: ${error.message}`,
            );
        }
    }

    async setCorrectiveDetail(
        dto: CorrectiveStInpDetailDto,
        ip: string,
        files: Express.Multer.File[],
        path: string,
    ) {
        try {
            const movedTargets: string[] = []; // เก็บ path ปลายทางที่ย้ายสำเร็จ

            const styType = await this.styTypeService.findByTypeCode('PT');
            if (!styType.status) {
                throw new Error('STY Type not found for code PT');
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const formno = await this.formService.getFormno(form);

            for (const list of dto.PA_LIST) {
                const index = dto.PA_LIST.indexOf(list);
                // insert and move image
                const movedFile = await this.styImageService.moveAndInsertFiles(
                    {
                        file: files[index],
                        path,
                        userCreate: dto.EMPNO,
                        typeId: styType.data[0].TYPE_ID,
                        folder: formno,
                    },
                );
                movedTargets.push(...movedFile.path);

                await this.stinpFormListService.update(
                    { ...form, NID: list.PA_ID },
                    {
                        VEMP_CORRECTIVE: list.PA_EMP_CORRECTIVE,
                        VCORRECTIVE: list.PA_CORRECTIVE,
                        DFINISH_DATE: list.PA_FINISH_DATE,
                        DMORNING_TALK: list.PA_MORNING_TALK,
                        NIMAGE_AFTER: movedFile.data.IMAGE_ID,
                    },
                );
            }

            if (dto.ACTION !== 'save') {
                await this.doactionService.doAction(
                    {
                        ...form,
                        EMPNO: dto.EMPNO,
                        ACTION: dto.ACTION,
                        REMARK: dto.REMARK,
                    },
                    ip,
                );
            }
            // throw new Error('test');
            return {
                status: true,
                message: 'Corrective action detail set successfully',
            };
        } catch (error) {
            throw new Error(
                `Failed to set corrective action detail: ${error.message}`,
            );
        }
    }
}
