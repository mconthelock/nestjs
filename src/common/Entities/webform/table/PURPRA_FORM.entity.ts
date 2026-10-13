import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PURPRA_REASONS } from './PURPRA_REASONS.entity';
import { PURPRA_GROUP } from './PURPRA_GROUP.entity';
import { PURPRA_COMMITTEE } from './PURPRA_COMMITTEE.entity';
import { PUR_FILE } from './PUR_FILE.entity';
import { FORM } from './FORM.entity';
import { PURPRA_LINK_KEY_VIEW } from '../views/PURPRA_LINK_KEY_VIEW.entity';

@Entity({ name: 'PURPRA_FORM', schema: 'WEBFORM' })
export class PURPRA_FORM {
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
    NMODE: number;

    @Column()
    VVENDOR: string;

    @Column()
    VPLANNER: string;

    @Column()
    VMATERIAL_CODE: string;

    @Column()
    VMAKER: string;

    @Column()
    VPART_NAME: string;

    @Column()
    VMODEL_NAME: string;

    @Column()
    VJOB_ITEM: string;

    @Column()
    NCOMMITTEE: number;

    @Column()
    NGROUP: number;

    @Column()
    NTOTAL_PRES: number;

    @Column()
    NTOTAL_NEW: number;

    @Column()
    NTOTAL_COST: number;

    @Column()
    NTOTAL_RATIO: number;

    @Column()
    DEFT_MONTH_START: Date;

    @Column()
    DEFT_MONTH_END: Date;

    @Column()
    VEFT_TYPE: string;

    @Column()
    VEFT_TYPE_OTHER: string;

    @Column()
    VDETAIL?: string;

    @OneToOne(() => FORM)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    FORM?: FORM;

    @OneToMany(() => PURPRA_REASONS, (p) => p.PURPRA_FORM)
    REASONS?: PURPRA_REASONS[];

    @OneToOne(() => PURPRA_GROUP)
    @JoinColumn({ name: 'NGROUP', referencedColumnName: 'NID' })
    GROUP?: PURPRA_GROUP;

    @OneToOne(() => PURPRA_COMMITTEE)
    @JoinColumn({ name: 'NCOMMITTEE', referencedColumnName: 'NID' })
    COMMITTEE?: PURPRA_COMMITTEE;

    @OneToMany(() => PUR_FILE, (p) => p.PURPRA_FORM)
    FILES?: PUR_FILE[];

    @OneToOne(() => PURPRA_LINK_KEY_VIEW)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'PFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'PORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'PYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'PYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'PRUNNO' })
    LINK_FORM?: PURPRA_LINK_KEY_VIEW;
}
