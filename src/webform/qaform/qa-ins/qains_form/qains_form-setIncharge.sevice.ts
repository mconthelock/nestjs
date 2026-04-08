import { Injectable } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { setInchargeQainsFormDto } from './dto/return-qains_form.dot';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FlowService } from 'src/webform/flow/flow.service';
import { QainsFormRepository } from './qains_form.repository';
import { MailService } from 'src/common/services/mail/mail.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';

@Injectable()
export class QainsFormSetInchargeService extends QainsFormService {
    constructor(
        protected readonly flowService: FlowService,
        protected readonly repo: QainsFormRepository,
        protected readonly mailService: MailService,
        private readonly doactionFlowService: DoactionFlowService,
    ) {
        super(flowService, repo, mailService);
    }
    async setIncharge(dto: setInchargeQainsFormDto, ip: string) {
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };

            // update flow incharge1
            const condSetFlow = {
                ...form,
                CEXTDATA: '01',
            };
            await this.setFlow(
                condSetFlow,
                dto.QA_INCHARGE_EMPNO,
                dto.QA_INCHARGE_EMPNO,
            );
            // update flow incharge2
            await this.setFlow(
                { ...condSetFlow, CEXTDATA: '02' },
                dto.QA_INCHARGE_EMPNO,
                dto.QA_INCHARGE_EMPNO,
            );

            // update ojt date and training date
            await this.update(
                {
                    ...form,
                    QA_INCHARGE_EMPNO: dto.QA_INCHARGE_EMPNO,
                },
            );


            // do action
            await this.doactionFlowService.doAction(
                {
                    ...form,
                    REMARK: dto.REMARK,
                    ACTION: dto.ACTION,
                    EMPNO: dto.EMPNO,
                },
                ip,
            );

            return {
                status: true,
                message: 'Set incharge successful',
                data: dto,
            };
        } catch (error) {
            return { status: false, message: 'Error: ' + error.message };
        }
    }
}
