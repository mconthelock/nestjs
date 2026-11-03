import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

import { LOANFRM } from '../../common/Entities/webform/table/LOANFRM.entity';
import { LOANDETAIL } from '../../common/Entities/webform/table/LOANDETAIL.entity';
import { EMP04 } from '../../common/Entities/gpreport/views/EMP04.entity';
import { EMP05 } from '../../common/Entities/gpreport/views/EMP05.entity';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([LOANFRM, LOANDETAIL, EMP04, EMP05], 'mitsuConnection'),
        MailModule,
    ],
    controllers: [LoanController],
    providers: [LoanService],
})
export class LoanModule {}
