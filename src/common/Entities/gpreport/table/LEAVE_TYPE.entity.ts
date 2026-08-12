// LV_CODE	VARCHAR2
// LV_TNAME	VARCHAR2
// LV_ENAME	VARCHAR2
// LV_SEQ	NUMBER
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'LEAVE_TYPE', schema: 'GPREPORT' })
export class LeaveType {
    @PrimaryColumn()
    LV_CODE: string;

    @Column()
    LV_TNAME: string;

    @Column()
    LV_ENAME: string;

    @Column()
    LV_SEQ: number;
}
