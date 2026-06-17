import { Injectable } from '@nestjs/common';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { CreatePsVarDto } from './dto/create-ps-var.dto';

@Injectable()
export class PsVarService {
    constructor(
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
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
    }
}
