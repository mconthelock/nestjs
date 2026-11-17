import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCmSmDto } from './dto/update-cm-sm.dto';
import { AlertCmSmEmailDto } from './dto/alert-cm-sm-email.dto';
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

    async alertEmail({ TINO, REVNO, empno, to, cc }: AlertCmSmEmailDto) {
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
        const departmentEmails: Record<string, string> = {
            EME: 'MOD_TI_EME@MitsubishiElevatorAsia.co.th',
            EEL: 'MOD_TI_EEL@MitsubishiElevatorAsia.co.th',
            EAS: 'MOD_TI_EAS@MitsubishiElevatorAsia.co.th',
        };
        const toDepartments = to
            .map((department) => department.trim().toUpperCase())
            .filter((department) => departmentEmails[department]);
        const ccDepartments = cc
            .map((department) => department.trim().toUpperCase())
            .filter((department) => departmentEmails[department]);
        const recipients = [...new Set(toDepartments.map((department) => departmentEmails[department]))];
        const ccRecipients = [
            ...new Set([
                'MOD_TI_SE@MitsubishiElevatorAsia.co.th',
                ...ccDepartments.map((department) => departmentEmails[department]),
            ]),
        ];
        if (!recipients.length) {
            throw new BadRequestException('At least one valid department is required in to');
        }

        await this.sendMail({
            to: recipients,
            cc: ccRecipients,
            TINO,
            REVNO,
            series: data.DTIH?.MODEL ?? data.DTIH?.PRODTY ?? '',
            reminderLabel,
            sentBy: empno, 
            toDepartment: to.join(', '),
            ccDepartment: cc.join(', '),
            detailUrl: "https://amecweb.mitsubishielevatorasia.co.th/dtiprogram/CM_SM/main",
        });
        await this.cmSmRepository.updateCountAlert(TINO, REVNO, time_reminder);

        return reminderLabel;
    }

    async sendMail(options: CmSmReminderMailOptions) {
        const issueDate = options.date ?? new Date().toLocaleString('en-US');

        return this.mailService.sendMail({
            from: 'perapatr@MitsubishiElevatorAsia.co.th',
            to: options.to,
            cc: options.cc,
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