import { Injectable } from '@nestjs/common';
import { FormDto } from '../form/dto/form.dto';
import { FormService } from '../form/form.service';
import { RqffrmRepository } from './rqffrm.repository';
import { RqflistService } from '../rqflist/rqflist.service';

@Injectable()
export class RqffrmService {
    constructor(
        private readonly repo: RqffrmRepository,
        private formService: FormService,
        private readonly rqflistService: RqflistService,
    ) {}

    async getData(form: FormDto) {
        return this.repo.findOne(form);
    }

    async findFromYear(FYear: string) {
        const quotation = await this.repo.findFromYear(FYear);
        const form = [];
        for (const q of quotation) {
            const formDetail = await this.formService.getFormDetail({
                NFRMNO: q.NFRMNO,
                VORGNO: q.VORGNO,
                CYEAR: q.CYEAR,
                CYEAR2: q.CYEAR2,
                NRUNNO: q.NRUNNO,
            });
            formDetail.data = q;
            form.push(formDetail);
        }
        return form;
    }
}
