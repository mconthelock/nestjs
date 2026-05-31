import { Injectable } from '@nestjs/common';
import { StInpRepository } from '../st-inp.repository';
import { FormmstService } from 'src/webform/center/formmst/formmst.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { FormService } from 'src/webform/center/form/form.service';
import { SequenceOrgService } from 'src/webform/center/sequence-org/sequence-org.service';
import { MailList } from './st-inp-mail-alert.interface';

@Injectable()
export class StInpJobAlertService {
    constructor(
        private readonly repo: StInpRepository,
        private readonly formmst: FormmstService,
        private readonly mailService: MailService,
        private readonly formService: FormService,
        private readonly sequenceOrgService: SequenceOrgService,
    ) {}

    async alert(date?: string) {
        try {
            const formmst = await this.formmst.getFormMasterByVaname('ST-INP');
            const list = await this.repo.getIgnoreList(
                formmst.NNO,
                formmst.VORGNO,
                formmst.CYEAR,
                date,
            );
            if (list.length === 0) {
                throw new Error(`No pending items found for alert.`);
            }
            const ddem = await this.sequenceOrgService.getByPosition({
                SPOSCODE: '21',
                VORGNO: '020601',
            });
            if (!ddem.status) {
                throw new Error(
                    `Manager with position code 21 and org code 020601 not found`,
                );
            }

            const semList: Record<string, MailList> = {};
            const demList: MailList = {
                mail: ddem.data.EMPINFO.SRECMAIL,
                name: ddem.data.EMPINFO.SNAME,
                list: [],
            };
            for (const l of list) {
                const formDetail = await this.formService.getFormDetail({
                    NFRMNO: l.NFRMNO,
                    VORGNO: l.VORGNO,
                    CYEAR: l.CYEAR,
                    CYEAR2: l.CYEAR2,
                    NRUNNO: l.NRUNNO,
                });
                if (!semList[l.SEM]) {
                    semList[l.SEM] = {
                        mail: l.SEM_MAIL,
                        name: l.NAME,
                        list: [
                            {
                                formno: formDetail.FORMNO,
                                link: formDetail.link, // + l.SEM,
                                diffDay: l.DIFF_DAY,
                                diffWeek: l.DIFF_WEEK,
                            },
                        ],
                    };
                } else {
                    semList[l.SEM].list.push({
                        formno: formDetail.FORMNO,
                        link: formDetail.link + l.SEM,
                        diffDay: l.DIFF_DAY,
                        diffWeek: l.DIFF_WEEK,
                    });
                }
                demList.list.push({
                    formno: formDetail.FORMNO,
                    link: formDetail.link, // + ddem.data.EMPINFO.SEMPNO,
                    diffDay: l.DIFF_DAY,
                    diffWeek: l.DIFF_WEEK,
                });
            }
            for (const sem of Object.values(semList)) {
                await this.mailService.sendMail({
                    from: `Safety System<${process.env.MAIL_FROM}>`,
                    to:
                        process.env.NODE_ENV != 'production'
                            ? process.env.MAIL_ADMIN
                            : sem.mail,
                    subject:
                        'Pending Form SAFETY INSPECTION REPORT Notification',
                    template: 'safety/patrol/pending-form',
                    context: sem,
                    bcc: process.env.MAIL_ADMIN,
                });
            }

            await this.mailService.sendMail({
                from: `Safety System<${process.env.MAIL_FROM}>`,
                to:
                    process.env.NODE_ENV != 'production'
                        ? process.env.MAIL_ADMIN
                        : demList.mail,
                subject: 'Pending Form SAFETY INSPECTION REPORT Notification',
                template: 'safety/patrol/pending-form',
                context: demList,
                bcc: process.env.MAIL_ADMIN,
            });
            return {
                list,
                semList,
                demList,
            };
        } catch (error) {
            await this.mailService.sendMail({
                from: `Safety System<${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_ADMIN,
                subject: 'Error in ST-INP Mail Alert Job',
                html: `<b>An error occurred while executing the ST-INP mail alert job:</b>
                <p>${error.message}</p>
                <br>
                <b>Stack Trace:</b>
                <p>${error.stack}</p>`,
            });
            throw new Error(`Failed to alert: ${error.message}`);
        }
    }
}
