import { Injectable } from '@nestjs/common';
import { CreateMfgVtrDto } from './dto/create-mfg-vtr.dto';
import { UpdateMfgVtrDto } from './dto/update-mfg-vtr.dto';
import { MfgVtrRepository } from './mfg-vtr.repository';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormService } from 'src/webform/form/form.service';
import { UsersService } from 'src/amec/users/users.service';

@Injectable()
export class MfgVtrService {
    constructor(
        private readonly mfgVtrRepository: MfgVtrRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly formService: FormService,
        private readonly userService: UsersService,
    ) {}

    async create(data: CreateMfgVtrDto, ip: string) {
        const formmst =
            await this.formmstService.getFormMasterByVaname('MFG-VTR');

        if (!formmst) {
            throw new Error(
                'Form master not found for MFG-VTR. Check FORMMST table.',
            );
        }

        const createForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: data.REQBY,
                INPUTBY: data.REQBY,
            },
            ip,
        );

        return await this.mfgVtrRepository.createRequest(
            {
                NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR: createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
                EMPNO: data.REQBY,
                STATUS: '1',
            },
            data.DETAILS,
        );
    }

    async getRequest() {
        const result = await this.mfgVtrRepository.getRequest();
        const users = await this.userService.search();
        const userMap = new Map(users.map((user) => [user.SEMPNO, user]));

        return await Promise.all(
            result.map(async (item) => ({
                ...item,
                FORM_NO: await this.formService.getFormno(item),
                EMP_DETAIL: userMap.get(item.EMPNO) ?? null,
            })),
        );
    }

    async getFormDetail(data: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
    }) {
        const result = await this.mfgVtrRepository.getFormDetail(data);

        if (!result) {
            return null;
        }

        return {
            ...result,
            FORM_NO: await this.formService.getFormno(result),
            EMP_DETAIL: await this.userService.findEmp(result.EMPNO),
        };
    }

    async updateStatus(data: UpdateMfgVtrDto) {
        const form = await this.mfgVtrRepository.getFormDetail(data);
        if (!form) {
            throw new Error('Form not found');
        }

        return await this.mfgVtrRepository.updateStatus(data);
    }
}
