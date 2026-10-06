import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import { DataSource } from 'typeorm';
import { MailService } from 'src/common/services/mail/mail.service';
import { InspectionReminderDto } from './dto/inspection-reminder.dto';

const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g,
    char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const clean = (value: unknown): string => String(value ?? '').trim();
type Recipient = { SEMPNO: string; SNAME: string; SRECMAIL: string };

@Injectable()
export class JigReminderService {
    private running = false;

    constructor(
        @InjectDataSource('iedocConnection') private readonly db: DataSource,
        private readonly mail: MailService,
    ) {}

    private runDate(input?: string): string {
        const date = input ?? new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Bangkok', day: '2-digit', month: '2-digit', year: 'numeric',
        }).format(new Date());
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) throw new BadRequestException('date must be DD/MM/YYYY');
        const [day, month, year] = date.split('/').map(Number);
        const parsed = new Date(Date.UTC(year, month - 1, day));
        if (year < 1000 || parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day)
            throw new BadRequestException('Invalid calendar date');
        return date;
    }

    private async cc(org: string, position: string): Promise<Recipient[]> {
        if (!org) return [];
        return this.db.query(`SELECT DISTINCT TRIM(P.VEMPNO) AS SEMPNO,
            TRIM(U.SNAME) AS SNAME, TRIM(U.SRECMAIL) AS SRECMAIL
            FROM WEBFORM.ORGPOS P
            LEFT JOIN AMEC.AMECUSERALL U ON TRIM(U.SEMPNO) = TRIM(P.VEMPNO)
            WHERE TRIM(P.VORGNO) = :1 AND TRIM(P.VPOSNO) = :2`, [org, position]);
    }

    async send(dto: InspectionReminderDto = {}) {
        const asOf = this.runDate(dto.date);
        if (this.running) throw new ConflictException('JIG reminder job is already running');
        this.running = true;
        try {
            // Oracle DATE stays a calendar date; no JS timezone conversion of the due date.
            const rows = await this.db.query(`SELECT J.JIG_NO, J.JIG_NAME, J.PIC_EMPNO,
                TO_CHAR(J.NEXT_INSPEC_DATE, 'DD/MM/YYYY') AS DUE_DATE,
                TRUNC(J.NEXT_INSPEC_DATE) - TO_DATE(:1, 'DD/MM/YYYY') AS DAYS_UNTIL_DUE,
                TRIM(U.SNAME) AS SNAME, TRIM(U.SRECMAIL) AS SRECMAIL,
                TRIM(U.SSECCODE) AS SSECCODE, TRIM(U.SDEPCODE) AS SDEPCODE
                FROM IEDOC.JIG_MASTER J
                LEFT JOIN AMEC.AMECUSERALL U ON TRIM(U.SEMPNO) = TRIM(J.PIC_EMPNO)
                WHERE J.JIG_STATUS = 'ACTIVE' AND J.NEXT_INSPEC_DATE IS NOT NULL
                AND (TRUNC(J.NEXT_INSPEC_DATE) - TO_DATE(:2, 'DD/MM/YYYY') IN (30, 14, 7)
                    OR TRUNC(J.NEXT_INSPEC_DATE) < TO_DATE(:3, 'DD/MM/YYYY'))
                ORDER BY J.NEXT_INSPEC_DATE, J.JIG_NO`, [asOf, asOf, asOf]);
            const items = [];
            const cache = new Map<string, Recipient[]>();
            const getCc = async (org: string, position: string) => {
                const key = `${org}:${position}`;
                if (!cache.has(key)) cache.set(key, await this.cc(org, position));
                return cache.get(key)!;
            };
            for (const row of rows) {
                const days = Number(row.DAYS_UNTIL_DUE);
                if (!Number.isFinite(days) || !(days < 0 || [30, 14, 7].includes(days))) continue;
                const overdue = days < 0;
                const item: any = { JIG_NO: row.JIG_NO, daysUntilDue: days,
                    type: overdue ? 'OVERDUE' : 'REMINDER', status: 'FAILED' };
                items.push(item);
                try {
                    const controller = { SEMPNO: clean(row.PIC_EMPNO), SNAME: clean(row.SNAME),
                        SRECMAIL: clean(row.SRECMAIL), SSECCODE: clean(row.SSECCODE), SDEPCODE: clean(row.SDEPCODE) };
                    const cc1 = await getCc(controller.SSECCODE, '30');
                    const cc2 = await getCc(controller.SDEPCODE, '20');
                    item.originalRecipients = { to: controller, cc1, cc2 };
                    const to = [...new Set((dto.to ?? [controller.SRECMAIL]).map(clean))];
                    const cc = [...new Set((dto.cc ?? [...cc1, ...cc2].map(person => clean(person.SRECMAIL)))
                        .map(clean))].filter(email => !to.some(address => address.toLowerCase() === email.toLowerCase()));
                    item.to = to;
                    item.cc = cc;
                    item.subject = overdue ? '[JIG Inspection] OVERDUE – Immediate Action Required'
                        : `[JIG Inspection] Reminder – Annual JIG Inspection Due Soon – ${days} Days`;
                    item.html = `<p>Dear Controller,</p>
<p>${overdue
    ? 'This is an automated notification that the following Annual JIG Inspection has exceeded its due date.'
    : 'This is an automated reminder that the following Annual JIG Inspection is approaching its due date.'}</p>
<p>JIG No. : ${escapeHtml(row.JIG_NO)}<br>
JIG Name : ${escapeHtml(row.JIG_NAME)}<br>
Controller : ${escapeHtml(controller.SNAME)}<br>
${overdue ? 'Due Date' : 'Next Inspection Due Date'} : ${escapeHtml(row.DUE_DATE)}<br>
${overdue ? 'Overdue' : 'Remaining'} : ${Math.abs(days)} Days</p>
${overdue ? '<p>Please complete the inspection as soon as possible.</p><p>This notification will be sent daily until the inspection has been completed and approved.</p>'
    : '<p>Please complete the inspection before the due date to ensure compliance with the annual inspection schedule.</p>'}
<p>Best regards,</p><p>JIG Yearly Inspection System<br>IE Department</p>`;
                    const issues = [];
                    if (!to.length || to.some(email => !isEmail(email))) issues.push('Controller/test TO email missing or invalid');
                    if (dto.cc === undefined && (!cc1.length || !cc2.length)) issues.push('CC1 or CC2 organization position not found');
                    if (cc.some(email => !isEmail(email))) issues.push('CC email missing or invalid');
                    item.issues = issues;
                    if (issues.length) { item.status = 'SKIPPED'; continue; }
                    if (dto.dryRun) { item.status = 'PREVIEW'; continue; }
                    const result = await this.mail.sendMail({ to, cc, subject: item.subject, html: item.html });
                    if (result?.rejected?.length) throw new Error(`SMTP rejected: ${result.rejected.join(', ')}`);
                    item.status = 'SENT';
                } catch (error) {
                    item.error = error instanceof Error ? error.message : String(error);
                }
            }
            const count = (status: string) => items.filter(item => item.status === status).length;
            return { asOf, dryRun: dto.dryRun ?? false, summary: { total: items.length,
                sent: count('SENT'), preview: count('PREVIEW'), skipped: count('SKIPPED'), failed: count('FAILED') }, items };
        } finally {
            this.running = false;
        }
    }
}
