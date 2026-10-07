import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('EXPAT_EMPLOYEE')
export class ExpatEmployee {

    @PrimaryColumn()
    SEMPNO: string;

    @Column()
    PASSPORT_NO: string;

    @Column()
    THAI_ADDR: string;

    @Column()
    TELNO: string;

    @Column()
    EMAIL: string;

    @Column()
    START_WORK_DATE: Date;

    @Column()
    SINGLE_WIN_DATE: Date;

    @Column()
    VISA_APPT_DATE: Date;

    @Column()
    VISA_EXP_DATE: Date;

    @Column()
    LAST_ARRIVAL_DATE: Date;

    @Column()
    LAST_ARRIVAL_UPD_DATE: Date;

    @Column()
    LAST_90DAY_DATE: Date;

    @Column()
    LAST_90DAY_UPD_DATE: Date;

}