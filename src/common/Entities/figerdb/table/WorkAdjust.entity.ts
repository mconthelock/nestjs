//BENEFICIARY เงินชดเชยกรณีเสียชีวิต
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'WorkAdjust', schema: 'dbo' })
export class WorkAdjust {
    @PrimaryColumn()
    DATETIMES: Date;

    @PrimaryColumn()
    SEMPNO: string;

    @Column()
    FIRSTNAME: string;

    @Column()
    LASTNAME: string;

    @Column()
    FUNCTIONKEY: string;

    @Column()
    WORKINGDATE: Date;

    @Column()
    DATE_IN: Date;

    @Column()
    TIME_IN: Date;

    @Column()
    DATE_OUT: Date;

    @Column()
    TIME_OUT: Date;

    @Column()
    REMARK: string;
}
