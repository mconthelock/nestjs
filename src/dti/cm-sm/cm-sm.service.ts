import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCmSmDto } from './dto/update-cm-sm.dto';
import { CmSmRepository } from './cm-sm.repository';
import { MailService } from 'src/common/services/mail/mail.service';

interface CmSmReminderMailOptions {
    to: string | string[];
    cc?: string | string[];
    TINO: string;
    REVNO: string;
    series?: string;
    reminderLabel: string;
    sentBy: string;
    date?: string;
    toDepartment?: string;
    ccDepartment?: string;
    detailUrl?: string;
}

@Injectable()
export class CmSmService {
    constructor(
        private readonly cmSmRepository: CmSmRepository,
        private readonly mailService: MailService,
    ) {}

    async save(payload: UpdateCmSmDto) {
        return this.cmSmRepository.save(payload);
    }

    async findAll() {
        return this.cmSmRepository.findAll();
    }

    async alertEmail(TINO: string, REVNO: string, empno: string) {
        if (!TINO || !REVNO) {
            throw new BadRequestException('TINO and REVNO are required');
        }

        // CM_SM row may not exist yet (source data lives in DTIH); create a blank one to track the count
        let data = await this.cmSmRepository.findOne(TINO, REVNO);
        if (!data) {
            data = await this.cmSmRepository.createBlank(TINO, REVNO, empno);
        }
        if (!data) {
            throw new NotFoundException(`CM-SM record not found: ${TINO}/${REVNO}`);
        }

        const time_reminder = (data.COUNT_ALERT ?? 0) + 1;
        const reminderLabel = this.ordinal(time_reminder);
        const to = [
            'perapatr@Mitsubishielevatorasia.co.th',
            'parichrt@MitsubishiElevatorAsia.co.th',
        ];
        if (!to) {
            throw new BadRequestException('CM_SM_ALERT_TO is not configured');
        }

        await this.sendMail({
            to,
            // cc: process.env.CM_SM_ALERT_CC,
            TINO,
            REVNO,
            series: data.DTIH?.MODEL ?? data.DTIH?.PRODTY ?? '',
            reminderLabel,
            sentBy: empno, 
            toDepartment: 'EME, EEL',
            ccDepartment: 'EAS',
            detailUrl: "http://localhost:8080/dtiprogram/CM_SM/main",
        });
        await this.cmSmRepository.updateCountAlert(TINO, REVNO, time_reminder);

        return reminderLabel;
    }

    async sendMail(options: CmSmReminderMailOptions) {
        const issueDate = options.date ?? new Date().toLocaleString('en-US');

        return this.mailService.sendMail({
            from: 'perapatr@MitsubishiElevatorAsia.co.th',
            to: options.to,
            // cc: options.cc,
            subject: `DAILY IDS FOR CM TI - CM TI NO. ${options.TINO}`,
            template: 'dti/cm-sm/daily-ids-follow-up',
            context: {
                ...options,
                reminderLabel: options.reminderLabel.toUpperCase(),
                issueDate,
            },
        });
    }

    private ordinal(n: number): string {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}