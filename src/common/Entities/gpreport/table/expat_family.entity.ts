import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EXPAT_FAMILY', schema: 'GPREPORT' })
export class ExpatFamily {

    @PrimaryColumn()
    SEMPNO: string;

    @PrimaryColumn()
    FID: number;

    @Column()
    RELATION: string;

    @Column()
    FULL_NAME: string;

    @Column()
    PASSPORT_NO: string;

    @Column()
    SINGLE_WIN_DATE: Date;

    @Column()
    VISA_APPT_DATE: Date;

    @Column()
    VISA_EXP_DATE: Date;

    @Column()
    LAST_ARRIVAL_DATE: Date;

}