import { Injectable } from '@nestjs/common';
import { DpmsPlOriginService } from 'src/workload/dpms_pl_origin/dpms_pl_origin.service';
import { ReviseShippingMarkDto } from '../dto/revise-shipping-mark.dto';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { ReviseMainService } from './revise-main.service';
import { now } from 'src/common/utils/dayjs.utils';
import { IListFilePath } from '../interface/issue.interface';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class ReviseShippingMarkService {
    constructor(
        private readonly originService: DpmsPlOriginService,
        private readonly revService: DpmsPlIssueRevService,
        private readonly reviseMainService: ReviseMainService,
        private readonly mailService: MailService,
    ) {}

    async reviseShippingMark(dto: ReviseShippingMarkDto) {
        const listFilePath: IListFilePath[] = [];
        try {
            await this.originService.create(dto.DATA);
            let message: string = 'Set country of origin successfully';

            if (dto.IS_REVISE) {
                const issueRevId = dto.ID;
                // ดึงข้อมูลจากตาราง dpms_pl_issue_rev โดยใช้ ID ที
                const revDataRes = await this.revService.findByRevId(dto.ID);
                if (!revDataRes.status) {
                    throw new Error('No data found for the given ID');
                }
                // หา origin จาก shipping mark
                const revData = revDataRes.data[0];
                const shippingMark = revData.VSHIPPINGMARK;
                const origin = shippingMark
                    .split('|')
                    .find((item) => /^made\s+in/i.test(item))
                    ?.replace(/^made\s+in\s*/i, '');
                // ดึงข้อมูล origin จากตาราง dpms_pl_origin โดยใช้ order
                const originByOrder = await this.originService.find({
                    order: revData.VORDERS,
                    type: 'order',
                });
                if (!originByOrder.status) {
                    throw new Error('No origin data found for the given order');
                }
                const newOrigin = originByOrder.data.SHIPPINGMARK_ON_PACKAGE;
                // เปรียบเทียบ origin เดิมกับ origin ใหม่ เพื่อ revise shipping mark ของ pl
                if (origin && origin != newOrigin) {
                    message =
                        'Set country of origin and auto revise shipping mark for packing list successfully';
                    const issueDate: string = now('DD/MM/YYYY');
                    const newShippingMark = shippingMark.replace(
                        new RegExp(`made\\s+in\\s*${origin}`, 'i'),
                        `MADE IN ${newOrigin}`,
                    );
                    const revise = await this.reviseMainService.revise({
                        revid: issueRevId,
                        poid: revData.NID,
                        order: revData.VORDERS,
                        issueDate: issueDate,
                        newShippingMark: newShippingMark,
                    });
                    if (!revise.status) {
                        throw new Error('Failed to revise shipping mark');
                    }
                    listFilePath.push(...revise.listFilePath);
                    await this.mailService.sendMail({
                        to: process.env.MAIL_ADMIN,
                        from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
                        subject:  `${now('YYYY-MM-DD HH:mm:ss')} Packing list Auto Revise Shipping Mark for Order: [${revData.VORDERS}] - NISSUEREV_ID: ${issueRevId}`,
                        attachments: revise.attachments,
                        html: `<p>Successfully revised shipping mark for Order: [${revData.VORDERS}] - NISSUEREV_ID: ${issueRevId}</p>`,

                    });
                }
            }

            // throw new Error('test');
            return {
                status: true,
                message: message,
            };
        } catch (error) {
            for (const file of listFilePath) {
                const filePath: string = await joinPaths(
                    file.filePath,
                    file.fileName,
                );
                await deleteFile(filePath);
            }
            throw new Error(error.message);
        }
    }
}
