import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { JigInspection } from './jig_inspection.entity';

@Entity({ name: 'JIG_MASTER' })
export class JigMaster {
    @PrimaryColumn()
    JIG_NO: string;

    @Column()
    JIG_NAME: string;

    @Column()
    DRAWING_NO: string | null;

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
    PARTS: string | null;

    @Column()
    PROCESS_CODE: string | null;

    @Column()
    PIC_EMPNO: string | null;

    @Column()
    INSPEC_PERIOD: number;

    @Column()
    NEXT_INSPEC_DATE: Date;

    @Column()
    JIG_STATUS: string;

    @Column()
    REMARK: string | null;

    @Column()
    CREATE_BY: string | null;

    @Column()
    CREATE_DATE: Date;

    @Column()
    UPDATE_BY: string | null;

    @Column()
    UPDATE_DATE: Date | null;

    @OneToMany(() => JigInspection, (inspection) => inspection.jig)
    inspections: JigInspection[];
}