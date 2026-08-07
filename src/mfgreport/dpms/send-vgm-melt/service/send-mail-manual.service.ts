import { Injectable } from '@nestjs/common';
import { ExportExcelService } from './export-excel.service';
import { SendVgmMeltService } from './send-vgm-melt.service';
import { SendVgmMeltRepository } from '../send-vgm-melt.repository';
import { MailService } from 'src/common/services/mail/mail.service';
import { SendMailManualDto } from '../dto/send-mail-manual.dto';
import { DpmsPlMeltLogService } from 'src/workload/dpms_pl_melt_log/dpms_pl_melt_log.service';
import { formatDate } from 'src/common/utils/dayjs.utils';

@Injectable()
export class SendMailManualService extends SendVgmMeltService {
    constructor(
        protected readonly repo: SendVgmMeltRepository,
        protected readonly mailService: MailService,
        protected readonly excelService: ExportExcelService,
        protected readonly logService: DpmsPlMeltLogService,
    ) {
        super(repo, mailService);
    }

    async sendManualByUser(dto: SendMailManualDto) {
        try {
            // 1. สร้าง Excel file จากข้อมูลที่ส่งมาใน dto
            const { buffer, filename } =
                await this.excelService.exportExcel(dto);

            // 2. บันทึก Log รายการส่งเมลลงในฐานข้อมูล
            const data = dto.DATA.map((item) => ({
                ...item,
                VANNDATE: dto.VANNDATE,
                LOGBY: dto.CREATEBY,
                SENTDATE: new Date(), // เพิ่มวันที่ปัจจุบัน
            }));
            const createdLog = await this.logService.create(data);
            if (!createdLog.status) {
                throw new Error(`Failed to create log: ${createdLog.message}`);
            }

            // 3. ตรวจสอบจำนวน Log ที่ถูกบันทึกลงในฐานข้อมูล
            const totalSent = await this.logService.getList(
                formatDate(dto.VANNDATE),
            );
            if (!totalSent.status) {
                throw new Error(
                    `Failed to retrieve total sent logs: ${totalSent.message}`,
                );
            }

            // 4. ส่งเมลพร้อมไฟล์แนบ
            const mailResult = await this.sendMail({
                attachments: [{ filename, content: buffer }],
                vanDate: dto.VANNDATE,
            });
            if (!mailResult.status) {
                throw new Error(mailResult.message);
            }

            return {
                status: true,
                message: `Manual email sent successfully`,
                data: totalSent.data, // ส่งกลับข้อมูล Log ที่ถูกสร้าง
            };
        } catch (error) {
            throw new Error(`Failed to send manual email: ${error.message}`);
        }
    }
}
