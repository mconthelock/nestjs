import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { GPUNF_FORM } from './GPUNF_FORM.entity';

import { UNIFORM } from 'src/common/Entities/gpreport/table/UNIFORM.entity';

@Entity({ name: 'GPUNF_DETAIL', schema: 'WEBFORM' })
export class GPUNF_DETAIL {
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
    URD_ID: number;

    @Column()
    UNIFORM_CATEGORY: number;

    @Column()
    UNIFORM_TYPE: number;

    @Column()
    UNIFORM_OLD_TYPE: number;

    @Column()
    QTY: number;

    @Column()
    REQUEST_TYPE: number;

    @ManyToOne(() => GPUNF_FORM, (form) => form.details)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    unfform: GPUNF_FORM;

    @OneToOne(() => UNIFORM, (uniform) => uniform.PROD_ID)
    @JoinColumn({ name: 'UNIFORM_TYPE', referencedColumnName: 'PROD_ID' })
    uniform: UNIFORM;

    @OneToOne(() => UNIFORM, (uniform) => uniform.PROD_ID)
    @JoinColumn({ name: 'UNIFORM_OLD_TYPE', referencedColumnName: 'PROD_ID' })
    olduniform: UNIFORM;
}
