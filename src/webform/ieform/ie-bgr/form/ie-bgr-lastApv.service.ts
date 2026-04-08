import { Injectable } from '@nestjs/common';
import { LastApvIeBgrDto } from './dto/lastapv-ie-bgr.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { IeBgrService } from './ie-bgr.service';

@Injectable()
export class IeBgrLastApvService extends IeBgrService {
    async lastApprove(dto: LastApvIeBgrDto, ip: string) {
        try {
            const form: FormDto = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            };
            // Insert PPRBIDDING
            for (const bidding of dto.pprbidding) {
                await this.pprbiddingService.create({
                    SPRNO: bidding.SPRNO,
                    BIDDINGNO: bidding.BIDDINGNO,
                    EBUDGETNO: bidding.EBUDGETNO,
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

            const flowtree = await this.flowService.getFlowTree(form);
            const emails: Array<string> = [];
            for (const f of flowtree) {
                if (
                    ['--', '04', '05', '06'].includes(f.CSTEPNO) &&
                    !emails.includes(f.SRECMAIL)
                ) {
                    emails.push(f.SRECMAIL);
                }
            }

            await this.mailService.sendMail({
                from: 'webflow_admin@MitsubishiElevatorAsia.co.th',
                to: emails,
                // to: process.env.MAIL_ADMIN,
                bcc: process.env.MAIL_ADMIN,
                subject: 'Budget Requisition Form completed in the system',
                html: `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                </head>
                <body>
                    <section>
                        <p>To : Requester and Concerned Manager,</p>
                        <span>This is to inform you that the <b>Budget Requisition Form</b></span>
                        <br>
                        <span><b>( Budget No. ${await this.formService.getFormno(form)} )</b> has been <b>approved and completed in the system.</b></span>
                        <br>
                        <p>Please proceed with the next related actions as required.</p>
                        <br>
                        <p>
                            Best regards,<br>
                            IS Department.<br>
                            Auto Send mail System.
                        </p>
                    </section>
                </body>
            </html>`,
            });
            return {
                status: true,
                message: 'Action successful',
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}