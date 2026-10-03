import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { SearchLoanDto } from './dto/search-loan.dto';

import { LOANFRM } from '../../common/Entities/webform/table/LOANFRM.entity';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(LOANFRM, 'gpreportConnection')
        private readonly loan: Repository<LOANFRM>,
    ) {}
    async search(q: SearchLoanDto) {
        const qb = this.loan
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.detail', 'detail')
            .leftJoinAndSelect('loan.guarantor', 'guarantor')
            .leftJoinAndSelect('loan.paid', 'paid')
            .leftJoinAndSelect('loan.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.requestor', 'user');
        await applyDynamicFilters(qb, q, 'loan');
        return qb.getMany();
    }
}
