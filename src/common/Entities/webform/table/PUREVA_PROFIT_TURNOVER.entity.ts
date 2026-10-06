import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    ManyToOne,
} from 'typeorm';
import { PUREVA_FORM } from './PUREVA_FORM.entity';

@Entity({ name: 'PUREVA_PROFIT_TURNOVER', schema: 'WEBFORM' })
export class PUREVA_PROFIT_TURNOVER {
    // --- Primary Keys (Composite Key 6 ตัว) ---

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

    @PrimaryColumn()
    ID: number;

    @Column()
    RECORD_TYPE: string;

    @Column({ type: 'decimal', precision: 4, scale: 0 })
    MYEAR: number;

    @Column({ type: 'decimal', precision: 14, scale: 2 })
    AMOUNT: number;

    @ManyToOne(() => PUREVA_FORM, (eva) => eva.PROFIT_TURNOVERS)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    Profit_Turnover: PUREVA_FORM;
}
