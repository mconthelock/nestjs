import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm'; //
import { FormService } from 'src/webform/form/form.service';
import { UsersService } from 'src/amec/users/users.service';
import { MailService } from 'src/common/services/mail/mail.service';
@Injectable()
export class IeTsJobService {
    constructor(
        @InjectDataSource('mitsuConnection')
        private readonly dataSource: DataSource,
        protected readonly formService: FormService,
        protected readonly usersService: UsersService,
        private readonly mailService: MailService,
    ) {}
    async alertaprove() {
        const sqlQuery = `
      SELECT
          fl.*,
          fl_max.APVDATELAST
      FROM form f
      INNER JOIN flow fl
          ON f.NFRMNO = fl.NFRMNO
          AND f.VORGNO = fl.VORGNO
          AND f.CYEAR = fl.CYEAR
          AND f.CYEAR2 = fl.CYEAR2
          AND f.NRUNNO = fl.NRUNNO
      LEFT JOIN (
          SELECT NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, MAX(DAPVDATE) AS APVDATELAST
          FROM flow
          GROUP BY NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO
      ) fl_max
          ON fl.NFRMNO = fl_max.NFRMNO
          AND fl.VORGNO = fl_max.VORGNO
          AND fl.CYEAR = fl_max.CYEAR
          AND fl.CYEAR2 = fl_max.CYEAR2
          AND fl.NRUNNO = fl_max.NRUNNO
      WHERE f.NFRMNO = '35' AND f.VORGNO = '051401' AND f.CYEAR = '26'  AND  f.CST = '1'
        AND fl.CSTEPST = '3' AND fl.CEXTDATA  IN ('01','03','04')
      UNION
      SELECT
          fl.*,
          fl_max.APVDATELAST
      FROM form f
      INNER JOIN flow fl
          ON f.NFRMNO = fl.NFRMNO
          AND f.VORGNO = fl.VORGNO
          AND f.CYEAR = fl.CYEAR
          AND f.CYEAR2 = fl.CYEAR2
          AND f.NRUNNO = fl.NRUNNO
      LEFT JOIN (
          SELECT NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, MAX(DAPVDATE) AS APVDATELAST
          FROM flow WHERE CEXTDATA = '01'
          GROUP BY NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO
      ) fl_max
          ON fl.NFRMNO = fl_max.NFRMNO
          AND fl.VORGNO = fl_max.VORGNO
          AND fl.CYEAR = fl_max.CYEAR
          AND fl.CYEAR2 = fl_max.CYEAR2
          AND fl.NRUNNO = fl_max.NRUNNO
      WHERE f.NFRMNO = '35' AND f.VORGNO = '051401' AND f.CYEAR = '26'  AND  f.CST = '1'
        AND fl.CSTEPST = '3' AND fl.CEXTDATA  = '02'
    `;
        let to = '';
        let cc = 'bundit@MitsubishiElevatorAsia.co.th';
        let from = 'webflow_admin@MitsubishiElevatorAsia.co.th';
        let html = '';
        let subject = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        try {
            // สั่ง Execute Raw Query
            const results = await this.dataSource.query(sqlQuery);
            if (results && results.length > 0) {
                // กำหนด type ให้ Object เพื่อลด Error ของ TypeScript (ถ้ามี)
                const sempnoGroup: { [key: string]: any[] } = {};

                results.forEach((item) => {
                    const SEMPNO = item.VAPVNO;
                    if (!sempnoGroup[SEMPNO]) sempnoGroup[SEMPNO] = [];
                    sempnoGroup[SEMPNO].push(item);
                });

                let listfrm = '';
                let chksendmail = false;

                // ลูปดึง [ รหัสพนักงาน, Array ข้อมูลฟอร์ม ] ออกมาจาก Object
                for (const [sempno, items] of Object.entries(sempnoGroup)) {
                    // items คือ Array ของฟอร์มที่พนักงานคนนั้นต้องอนุมัติ จึงใช้ for...of ได้แล้ว
                    for (const frm of items) {
                        const apvDateLast = new Date(frm.APVDATELAST);
                        apvDateLast.setHours(0, 0, 0, 0); // รีเซ็ตเวลาเป็น 00:00:00 เพื่อเทียบแค่วันที่
                        if (apvDateLast < today) {
                            chksendmail = true;
                            const frmname = await this.formService.getFormno({
                                NFRMNO: frm.NFRMNO,
                                VORGNO: frm.VORGNO,
                                CYEAR: frm.CYEAR,
                                CYEAR2: frm.CYEAR2,
                                NRUNNO: frm.NRUNNO,
                            });
                            listfrm !== '' ? (listfrm += `, ${frmname}`) : (listfrm = `${frmname}`);
                        }

                        // นำ frmname ไปต่อ string หรือทำ logic อื่นๆ ต่อตรงนี้...
                    }
                    if (chksendmail) {
                        const emp = await this.usersService.findEmp(sempno);
                        if (emp) {
                            to = emp.SRECMAIL;
                            subject = 'TEST [Approval Request] ' + listfrm + ' Pending Approval';
                            html = `
<div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaec; border-radius: 8px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">

    <!-- Header -->
    <div style="background-color: #00467f; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #ffffff; font-size: 18px; letter-spacing: 0.5px;">TS Adjustment Approval</h2>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
        <p style="margin-top: 0; font-size: 15px; color: #333333;"><strong>Dear Sir,</strong></p>
        <p style="font-size: 14px; line-height: 1.6; color: #555555;">
            This is an automated notification from the Web Flow System. The following <strong>TS Adjustment</strong> request is currently awaiting your approval:
        </p>

        <!-- Dynamic Content Box -->
        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #00467f; padding: 15px; margin: 20px 0; border-radius: 4px; color: #333333; font-size: 14px; line-height: 1.5;">
            ${listfrm}
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #555555; margin-bottom: 25px;">
            Please review and approve the request through the Web Flow System.
        </p>

        <!-- Text Link -->
<div style="text-align: center; margin-top: 30px; margin-bottom: 10px;">
            <a href="http://webflow.mitsubishielevatorasia.co.th/form" style="color: #0056b3 !important; text-decoration: underline; font-size: 14px; font-weight: bold; word-break: break-all;">
                <span style="color: #0056b3;">[Open Web Flow System]</span>
            </a>
        </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f4f6f8; padding: 15px; text-align: center; border-top: 1px solid #eaeaec;">
        <p style="margin: 0; font-size: 12px; color: #888888;">This is an automatically generated email, please do not reply.</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #888888;">Web Flow System &copy; Mitsubishi Elevator Asia</p>
    </div>

</div>
`;
                            this.mailService.sendMail({
                                from: from,
                                to: to,
                                subject,
                                html,
                                cc: cc,
                            });
                        }
                    }
                }
            }
        } catch (error) {
            // เพิ่มบล็อก catch ตรงนี้ เพื่อดักจับ Error
            console.error('เกิดข้อผิดพลาดในการ Query ฐานข้อมูล:', error);
            throw error; // หรือจัดการ error ตามความเหมาะสม
        }
    }
}
