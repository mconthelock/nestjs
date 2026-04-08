import { Injectable } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { QcConfQainsFormDto } from './dto/qcConfirm-qains_form.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { MailService } from 'src/common/services/mail/mail.service';
import { QainsFormRepository } from './qains_form.repository';
import { FlowService } from 'src/webform/flow/flow.service';
import { AmecUserAllService } from 'src/amec/amecuserall/amecuserall.service';
import { OrgposService } from 'src/webform/orgpos/orgpos.service';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { formatDate } from 'src/common/utils/dayjs.utils';

@Injectable()
export class QainsFormQcConfirmService extends QainsFormService {
    constructor(
        protected readonly flowService: FlowService,
        protected readonly repo: QainsFormRepository,
        protected readonly mailService: MailService,

        private readonly amecuserAllService: AmecUserAllService,
        private readonly orgposService: OrgposService,
        private readonly qainsOAService: QainsOAService,
        private readonly doactionFlowService: DoactionFlowService,
    ) {
        super(flowService, repo, mailService);
    }

    async qcConfirm(dto: QcConfQainsFormDto, ip: string) {
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            var fr = dto.QCFOREMAN;
            var ld = dto.QCLEADER;
            if (!fr) {
                fr = ld;
            } else if (!ld) {
                ld = fr;
            }
            // update flow qc foreman
            const condForeman = {
                condition: {
                    ...form,
                    CEXTDATA: '05',
                },
                VAPVNO: fr,
                VREPNO: ld,
            };
            await this.flowService.updateFlow(condForeman);

            // update flow qc sem
            const foreman = await this.amecuserAllService.findEmp(fr);
            if (!foreman.status) {
                throw new Error(`Foreman with empno ${fr} not found`);
            }
            const qcsem = await this.orgposService.getOrgPos({
                VPOSNO: '30',
                VORGNO: foreman.data.SSECCODE,
            });
            if (qcsem.length > 0) {
                const condSem = {
                    condition: {
                        ...form,
                        CEXTDATA: '06',
                    },
                    VAPVNO: qcsem[0].VEMPNO,
                    VREPNO: qcsem[0].VEMPNO,
                };
                await this.flowService.updateFlow(condSem);
            }
            // update ojt date and training date
            await this.update({
                ...form,
                QA_TRAINING_DATE: dto.TRAINING_DATE,
                QA_OJT_DATE: dto.OJTDATE,
                QA_REV: dto.QA_REV,
            });

            // clear
            await this.qainsOAService.delete({ ...form, QOA_TYPECODE: 'ESA' });

            // insert auditor
            for (const e of dto.AUDITOR) {
                await this.qainsOAService.createQainsOA({
                    ...form,
                    QOA_TYPECODE: 'ESA',
                    QOA_EMPNO: e,
                });
            }
            // do action
            await this.doactionFlowService.doAction(
                {
                    ...form,
                    REMARK: dto.REMARK,
                    ACTION: dto.ACTION,
                    EMPNO: dto.EMPNO,
                },
                ip,
            );
            // auto mail
            await this.sendmailToReqManager(form);
            return {
                status: true,
                message: 'Action successful',
                data: dto,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async sendmailToReqManager(form: FormDto) {
        const data = await this.getFormData(form);
        const operator = await this.qainsOAService.searchQainsOA({
            ...form,
            QOA_TYPECODE: 'ESO',
        });
        const item = data.QA_ITEM;
        let html = `<div style="font-size:14px; color:#000;">`;
        const seccode = [
            ...new Set(operator.map((o) => o.QOA_EMPNO_INFO.SSECCODE)),
        ];
        // 2026-04-02 cc ไปหา qc auditor ด้วย**
        const auditor = await this.qainsOAService.searchQainsOA({
            ...form,
            QOA_TYPECODE: 'ESA',
        });
        let auditorMails: string[] = [];
        for (const a of auditor) {
            const empInfo = await this.amecuserAllService.findEmp(a.QOA_EMPNO);
            if (!empInfo.status) continue;
            auditorMails.push(empInfo.data.SRECMAIL);
        }

        for (const sec of seccode) {
            const semEmpno = await this.orgposService.getOrgPos({
                VPOSNO: '30',
                VORGNO: sec,
            });
            const semInfo = await this.amecuserAllService.findEmp(
                semEmpno[0].VEMPNO,
            );
            if (!semInfo.status) {
                continue;
            }

            html += `<b>Dear ${semInfo.data.SNAME}</b>
        <p>
            I'm writing to arrange a time for 
            <span style="font-weight:bold; color:#0000FF;">
                quality built in for item ${item} on ${data.QA_OJT_DATE ? formatDate(data.QA_OJT_DATE, 'DD-MMM-YY') : '-'} ${data.QA_OJT_DATE ? formatDate(data.QA_OJT_DATE, 'HH:mm') : '00:00'} 
            </span>.
            <br>
            Please prepare part orders for quality built in.
        </p>

        <table cellpadding="6" cellspacing="0" border="1" 
        style="border: 1px solid #aaa; width: 100%; padding: 0px; font-size: 0.85em;">
            <thead>
                <tr style="background:#fce4ec; text-align:left; padding: 10px 0px;">
                <th style="border:1px solid #ccc;">No.</th>
                <th style="border:1px solid #ccc;">Emp. Code</th>
                <th style="border:1px solid #ccc;">Name - Surname</th>
                <th style="border:1px solid #ccc;">Item</th>
                <th style="border:1px solid #ccc;">Sec.</th>
                </tr>
            </thead>
            <tbody>`;
            let no = 1;
            for (const o of operator) {
                if (o.QOA_EMPNO_INFO.SSECCODE === sec) {
                    html += `<tr style="background-color: #fff;padding: 10px; 5px;>
          <td style="border:1px solid #ccc; text-align:center;">${no}</td>
          <td style="border:1px solid #ccc; text-align:center;">${o.QOA_EMPNO}</td>
          <td style="border:1px solid #ccc; text-align:center;">${o.QOA_EMPNO_INFO.SNAME}</td>
          <td style="border:1px solid #ccc; text-align:center;">${item}</td>
          <td style="border:1px solid #ccc; text-align:center;">${o.QOA_EMPNO_INFO.SSEC}</td>
          </tr>
            `;
                    no++;
                }
            }
            html += `</tbody>
            </table>
            <p>
                Best regards,<br>
                IS Department.<br>
                Auto Send mail System.
            </p>
        </div>`;
            await this.mailService.sendMail({
                to: semInfo.data.SRECMAIL,
                cc: auditorMails,
                bcc: process.env.MAIL_ADMIN,
                from: 'webflow_admin@mitsubishielevatorasia.co.th',
                subject: `Quality built in item ${item}`,
                html: html,
            });
        }
    }
}
