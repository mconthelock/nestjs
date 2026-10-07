import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePsUpiDto } from './dto/create-ps-upi.dto';
import { PsUpiRepository } from './ps-upi.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { SearchReportDto } from './dto/search-report.dto';
import { FormService } from 'src/webform/form/form.service';

@Injectable()
export class PsUpiService {
    constructor(
        private readonly repo: PsUpiRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly doactionService: DoactionFlowService,
        private readonly formService: FormService,
    ) {}

    async getReason() {
        return this.repo.getReason();
    }

    async submit(dto: CreatePsUpiDto, ip: string) {
        const formFields = [
            dto.NFRMNO,
            dto.VORGNO,
            dto.CYEAR,
            dto.CYEAR2,
            dto.NRUNNO,
        ];
        const hasFormKey = formFields.some(
            (value) => value !== undefined && value !== null && value !== '',
        );
        const hasCompleteFormKey = formFields.every(
            (value) => value !== undefined && value !== null && value !== '',
        );

        if (hasFormKey && !hasCompleteFormKey) {
            throw new BadRequestException(
                'NFRMNO, VORGNO, CYEAR, CYEAR2, and NRUNNO must all be provided to edit a form',
            );
        }

        if (hasCompleteFormKey) {
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            const list = await this.repo.replaceList(
                form,
                this.mapListRows(dto, form),
            );

            const doAction = await this.doactionService.doAction(
                {
                    ...form,
                    EMPNO: dto.REQUEST_BY,
                    ACTION: 'approve',
                },
                ip,
            );
            if (!doAction.status) {
                throw new Error(doAction.message);
            }

            return {
                status: true,
                message: 'PS-UPI form updated successfully',
                data: { form, list },
            };
        }

        const formmst =
            await this.formmstService.getFormMasterByVaname('PS-UPI');
        if (!formmst) {
            throw new Error(
                'Form master not found for PS-UPI. Check FORMMST table.',
            );
        }
        const createForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: dto.REQUEST_BY,
                INPUTBY: dto.INPUT_BY,
            },
            ip,
        );

        const form = {
            NFRMNO: createForm.data.NFRMNO,
            VORGNO: createForm.data.VORGNO,
            CYEAR: createForm.data.CYEAR,
            CYEAR2: createForm.data.CYEAR2,
            NRUNNO: createForm.data.NRUNNO,
        };

        const list = await this.repo.insertList(this.mapListRows(dto, form));

        return {
            status: true,
            message: 'PS-UPI form created successfully',
            data: { form, list },
        };
    }

    private mapListRows(dto: CreatePsUpiDto, form: FormDto) {
        return dto.LIST_DATA.map((item) => ({
            ...form,
            PUR_CODE: item.PUR_CODE,
            DESCRIPTION: item.DESC,
            DRAWING_NO: item.DRAWING,
            ADDRESS: item.ADDR,
            WHI_USER: item.WHI_USER,
            QUANTITY: item.QTY,
            PRODUCTION: item.PRODUCTION,
            ISSUE_TO: item.ISSUE_TO,
            REASON_CODE: item.REASON,
            REASON_DETAIL: item.REASON_DETAIL,
            PLAN_RETURN_DATE: new Date(item.RETURN_DATE),
        }));
    }

    async getDataForm(dto: FormDto) {
        return this.repo.getDataForm(dto);
    }

    async getReport(dto: SearchReportDto) {
        let report = await this.repo.getReport(dto);
        report = await Promise.all(
            report.map(async (item) => ({
                ...item,
                formno: await this.formService.getFormno({
                    NFRMNO: item.NFRMNO,
                    VORGNO: item.VORGNO,
                    CYEAR: item.CYEAR,
                    CYEAR2: item.CYEAR2,
                    NRUNNO: item.NRUNNO,
                }),
            })),
        );
        return report;
    }
}
