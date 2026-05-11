import { Injectable } from '@nestjs/common';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { StInpService } from './st-inp.service';
import { deleteFile } from 'src/common/utils/files.utils';
import { EvaluateStInpDto } from './dto/evaluate-st-inp.dto';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { StyTypeService } from 'src/gpreport/sty-type/sty-type.service';
import { StyImageService } from 'src/gpreport/sty-image/sty-image.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { StinpFormListService } from 'src/gpreport/stinp-form-list/stinp-form-list.service';
import { StinpFormService } from 'src/gpreport/stinp-form/stinp-form.service';

@Injectable()
export class StInpEvaluateService extends StInpService {
    constructor(
        protected readonly createFormService: FormCreateService,
        protected readonly formmstService: FormmstService,
        protected readonly styImageService: StyImageService,
        protected readonly styTypeService: StyTypeService,
        protected readonly stinpFormService: StinpFormService,
        protected readonly stinpFormListService: StinpFormListService,
        protected readonly flowService: FlowService,
        protected readonly formService: FormService,
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

    async setEvaluate(dto: EvaluateStInpDto, ip: string) {
        try {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            for (const list of dto.EVALUATE_LIST) {
                const data = {
                    ...form,
                    PA_ID: list.PA_ID,
                    PA_AUDIT_EVALUATE: list.PA_AUDIT_EVALUATE,
                };
                await this.stinpFormListService.update(
                    { ...form, NID: list.PA_ID },
                    {
                        NAUDIT_EVALUATE: list.PA_AUDIT_EVALUATE,
                    },
                );
            }

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
                message: 'Evaluation set successfully',
            };
        } catch (error) {
            throw new Error(`Failed to set evaluation: ${error.message}`);
        }
    }
}
