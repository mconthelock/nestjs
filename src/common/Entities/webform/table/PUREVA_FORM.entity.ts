import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PUR_FILE } from './PUR_FILE.entity';
import { PUREVA_PROFIT_TURNOVER } from './PUREVA_PROFIT_TURNOVER.entity';
import { PUREVA_SCORE } from './PUREVA_SCORE.entity';
import { PUREVA_VENDOR_RELATION } from './PUREVA_VENDOR_RELATION.entity';
import { PURNVF_ADDRESS } from './PURNVF_ADDRESS.entity';
import { PCURRENCY } from '../../amec/table/PCURRENCY.entity';
import { VORGMST } from '../views/VORGMST.entity';
import { TERMCODE } from '../../pursys/table/TERMCODE.entity';

@Entity({ name: 'PUREVA_FORM', schema: 'WEBFORM' })
export class PUREVA_FORM {
    // --- Primary Keys ---

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
    OPERATION: string;

    @Column()
    VENDCODE: string;

    @Column()
    VENDGROUP: string;

    @Column()
    UPSTATUS: string;

    @Column()
    VENDPURPOSE: string;

    @Column()
    COMNAME: string;

    @Column()
    VENDTYPE: string;

    @Column()
    CONTACT: string;

    @Column()
    EMAIL: string;

    @Column()
    WEBSITE: string;

    @Column()
    TELNO: string;

    @Column()
    FAX: string;

    @Column()
    BANKNAME: string;

    @Column()
    BRANCH: string;

    @Column()
    BANKADDR: string;

    @Column()
    ACCNUMBER: string;

    @Column()
    TERMCODE: string;

    @Column()
    CURCODE: string;

    @Column()
    COMPLIANCE: string;

    @Column()
    COMPLIANCE_OTHER: string;

    @Column()
    BUSTYPE_REG: string;

    @Column()
    BUSTYPE_SUB: string;

    @Column()
    PRODCAT: string;

    @Column()
    LEGAL_STATUS: string;

    @Column()
    CORPORATE_ID: string;

    @Column()
    TAX_ID: string;

    @Column()
    CONCERNEDORG: string;

    @Column()
    FY_AMOUNT: string;

    // Type Number with Precision & Scale
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    AMOUNT: number;

    @Column()
    PUR_LEVEL: string;

    @Column()
    PUR_STATUS: string;

    @Column()
    VENDCAT: string;

    @Column({ type: 'decimal', precision: 14, scale: 2 })
    CAPITAL: number;

    @Column()
    CAPITAL_CUR: string;

    @Column()
    ESTABLISHED: string;

    @Column()
    COM_TYPE: string;

    @Column()
    COM_OTHER: string;

    @Column({ type: 'decimal', precision: 6, scale: 0 })
    EMPDIRECT: number;

    @Column({ type: 'decimal', precision: 6, scale: 0 })
    EMPINDIRECT: number;

    @Column()
    AVGAGE: string;

    @Column()
    QM_STATUS: string;

    @Column()
    QM_REASON: string;

    @Column()
    CSR_STATUS: string;

    @Column()
    CSR_REASON: string;

    @Column()
    ENV_STATUS: string;

    @Column()
    ENV_REASON: string;

    @Column()
    LABOR_STATUS: string;

    @Column()
    LABOR_ESTABLISH_DATE: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    LAND: number;

    // รักษาตัวสะกดตาม SQL 原ฉบับ (FATORY)
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    FACTORY: number;

    @Column()
    JUDGEMENT: string;

    @Column()
    MJUDGEMENT: string;

    @Column()
    ATTACH_TYPE: string;

    @Column()
    ATTACH_OTHER: string;

    @OneToMany(() => PUR_FILE, (f) => f.MASTER)
    FILES: PUR_FILE[];

    @OneToMany(() => PUREVA_PROFIT_TURNOVER, (p) => p.Profit_Turnover)
    PROFIT_TURNOVERS: PUREVA_PROFIT_TURNOVER[];

    @OneToMany(() => PUREVA_SCORE, (s) => s.Scores)
    SCORES: PUREVA_SCORE[];

    @OneToMany(() => PUREVA_VENDOR_RELATION, (r) => r.Relations)
    RELATIONS: PUREVA_VENDOR_RELATION[];

    @OneToMany(() => PURNVF_ADDRESS, (a) => a.MASTER_EVAADDR)
    ADDRESSES: PURNVF_ADDRESS[];

    @OneToOne(() => TERMCODE)
    @JoinColumn({ name: 'TERMCODE', referencedColumnName: 'STERMCODE' })
    TERM: TERMCODE;

    @OneToOne(() => PCURRENCY)
    @JoinColumn({ name: 'CURCODE', referencedColumnName: 'SCURCODE' })
    STDCUR: PCURRENCY;

    @OneToOne(() => VORGMST)
    @JoinColumn({ name: 'CONCERNEDORG', referencedColumnName: 'VORGNO' })
    VORG: VORGMST;
}
