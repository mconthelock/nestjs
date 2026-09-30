import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'JIG_FORM' })
export class JigForm {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    FORM_TYPE: 'CREATE' | 'INSPECTION';

    @Column()
    JIG_NO: string;

    @Column()
    JIG_NAME: string;

    @Column()
    DWG: string | null;

    @Column()
    REV_OLD: string | null;

    @Column()
    REV: string | null;

    @Column()
    JIG_QTY: number | null;

    @Column()
    PRICE: number | null;

    @Column()
    MAKER: string | null;

    @Column()
    START_USE_DATE: Date | null;

    @Column()
    ITEMNO: string | null;

    @Column()
    JIG_DESC: string | null;

    @Column()
    PROCESS_CODE: string | null;

    @Column()
    LOCATION: string | null;

    @Column()
    PIC_EMPNO: string | null;

    @Column()
    INSPEC_PERIOD: number;

    @Column()
    REMARK: string | null;
}