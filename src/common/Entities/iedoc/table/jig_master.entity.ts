import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'JIG_MASTER' })
export class JigMaster {
    @PrimaryColumn()
    JIG_NO: string;

    @Column()
    JIG_NAME: string;

    @Column()
    DWG: string | null;

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
    NEXT_INSPEC_DATE: Date | null;

    @Column()
    JIG_STATUS: string | null;

    @Column()
    REMARK: string | null;

    @Column()
    REF_CYEAR2: string | null;

    @Column()
    REF_NRUNNO: number | null;
}