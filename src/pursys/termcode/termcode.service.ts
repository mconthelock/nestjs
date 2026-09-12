import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TermPayment } from 'src/common/Entities/pursys/table/TERM_PAYMENT.entity';
import { TermTrade } from 'src/common/Entities/pursys/table/TERM_TRADE.entity';

@Injectable()
export class TermcodeService {
    constructor(
        @InjectRepository(TermPayment, 'purConnection')
        private readonly payment: Repository<TermPayment>,

        @InjectRepository(TermTrade, 'purConnection')
        private readonly trade: Repository<TermTrade>,
    ) {}

    findPayment() {
        return this.payment.find();
    }

    findTrade() {
        return this.trade.find();
    }
}
