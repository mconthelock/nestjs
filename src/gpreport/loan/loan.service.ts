import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { MailService } from 'src/common/services/mail/mail.service';
import { SearchLoanDto } from './dto/search-loan.dto';
import { LoanMailRow, SendLoanMailDto } from './dto/send-loan-mail.dto';

import { LOANFRM } from '../../common/Entities/webform/table/LOANFRM.entity';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(LOANFRM, 'gpreportConnection')
        private readonly loan: Repository<LOANFRM>,
        private readonly mailService: MailService,
    ) {}
    async search(q: SearchLoanDto) {
        const qb = this.loan
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.detail', 'detail')
            .leftJoinAndSelect('loan.guarantor', 'guarantor')
            .leftJoinAndSelect('loan.paid', 'paid')
            .leftJoinAndSelect('loan.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.reqtor', 'user');
        await applyDynamicFilters(qb, q, 'loan');
        return qb.getMany();
    }

    async send(dto: SendLoanMailDto, file: Express.Multer.File) {
        const escape = (s: unknown) =>
            String(s ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

        let rows: LoanMailRow[];
        try {
            rows = JSON.parse(dto.data);
            if (!Array.isArray(rows)) throw new Error();
        } catch {
            throw new BadRequestException('data must be a JSON array');
        }

        const message =
            dto.message ||
            `Loan payment list${dto.sdate ? ` for ${dto.sdate}` : ''} is attached.`;

        await this.mailService.sendMail({
            template: 'gpreport/loan/loan',
            from: `Ms.Jantagan Krisanamara <jantagan@MitsubishiElevatorAsia.co.th>`,
            to: dto.to,
            subject: dto.subject || 'Loan Document',
            context: {
                recipientName: dto.recipientName || 'All Concerned',
                message: escape(message).replace(/\n/g, '<br>'),
                message_ps: escape(dto.message_ps).replace(/\n/g, '<br>'),
                showTable: rows.length > 0,
                tableHeaders: [
                    'เลขที่สัญญา',
                    'รหัสพนักงาน',
                    'ชื่อพนักงาน',
                    'ตำแหน่ง',
                    'แผนก',
                    'วันที่โอนเงิน',
                    'วงเงินกู้',
                ],
                tableRows: rows.map((r) =>
                    [
                        r.LOANNO,
                        r.SEMPNO,
                        r.STNAME,
                        r.SPOSNAME,
                        r.SSEC,
                        r.PAYDATE,
                        r.AMOUNT,
                    ].map(escape),
                ),
            },
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer,
                },
            ],
        });
        return true;
    }
}
