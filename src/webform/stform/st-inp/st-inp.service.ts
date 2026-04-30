import { Injectable } from '@nestjs/common';
import { CreateStInpDto } from './dto/create-st-inp.dto';
import { UpdateStInpDto } from './dto/update-st-inp.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

@Injectable()
export class StInpService {
    constructor(
        private readonly createFormService: FormCreateService,
        private readonly formmstService: FormmstService,
    ) {}
    async create(dto: CreateStInpDto, ip: string) {
        try {
            const formmst =
                await this.formmstService.getFormMasterByVaname('ST-INP');
            if (!formmst) {
                throw new Error('Form master not found for ST-INP');
            }
            const form = await this.createForm(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: dto.REQBY,
                    INPUTBY: dto.INPUTBY,
                    REMARK: dto.REMARK,
                    DRAFT: dto.DRAFT,
                },
                ip,
            );
        } catch (error) {
            throw new Error(
                `Failed to create safety inspection report: ${error.message}`,
            );
        }
    }

    async createForm(dto: CreateFormDto, ip: string) {
        try {
            const createForm = await this.createFormService.create(dto, ip);
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }

            return {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
        } catch (error) {
            throw new Error(`Failed to create form: ${error.message}`);
        }
    }
}
