//EMPLOYEE_MAIL_LOG: ประวัติการเปลี่ยนแปลงแก้ไขอีเมลล์ส่วนตัว
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'EMPLOYEE_MAIL_LOG', schema: 'GPREPORT' })
export class EmailLogs {
    @PrimaryColumn()
    LOG_EMPNO: string;

    @Column()
    LOG_MAILNEW: string;

    @Column()
    LOG_MAILEX: string;

    @Column()
    UPDATE_BY: string;

    @Column()
    UPDATE_AT: string;

    @PrimaryColumn()
    UPDATE_DATE: string;
}
