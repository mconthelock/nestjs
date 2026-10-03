import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

import { LOANFRM } from '../../common/Entities/webform/table/LOANFRM.entity';
import { LOANDETAIL } from '../../common/Entities/webform/table/LOANDETAIL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([LOANFRM, LOANDETAIL], 'gpreportConnection'),
    ],
    controllers: [LoanController],
    providers: [LoanService],
})
export class LoanModule {}
