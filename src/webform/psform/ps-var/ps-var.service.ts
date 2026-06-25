import { Injectable } from '@nestjs/common';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { CreatePsVarDto } from './dto/create-ps-var.dto';
import { PsVarRepository } from './ps-var.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class PsVarService {
    constructor(
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly psVarRepository: PsVarRepository,
    ) {}

    async CreateForm(data: CreatePsVarDto, ip: string) {
        const formmst =
            await this.formmstService.getFormMasterByVaname('PS-VAR');
        if (!formmst) {
            throw new Error(
                'Form master not found for PS-VAR. Check FORMMST table.',
            );
        }
        const createForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: data.REQBY,
                INPUTBY: data.INPUTBY,
            },
            ip,
        );

        const psvar_form = {
            NFRMNO: createForm.data.NFRMNO,
            VORGNO: createForm.data.VORGNO,
            CYEAR: createForm.data.CYEAR,
            CYEAR2: createForm.data.CYEAR2,
            NRUNNO: createForm.data.NRUNNO,
            REPORT_ID: data.REPORT_ID,
        };
        await this.psVarRepository.insert_psvar_form(psvar_form);
    }

    async getDataResult(reportID: number) {
        const data = await this.psVarRepository.getDataResult(reportID);
        return data;
    }

    async getDataResult2(dto: FormDto) {
        const data = await this.psVarRepository.getDataResult2(dto);
        return data;
    }
}
