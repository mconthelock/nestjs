import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { FORM } from './FORM.entity';
import { GPUNF_DETAIL } from './GPUNF_DETAIL.entity';
import { GPUNF_TYPE } from './GPUNF_TYPE.entity';

@Entity({ name: 'GPUNF_FORM', schema: 'WEBFORM' })
export class GPUNF_FORM {
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
    REQUEST_TYPE: string;

    @Column()
    JOB: string;

    @Column()
    ATTACH_FILE: string;

    @Column()
    EMP_INPUT: string;

    @Column()
    EMP_REQUEST: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    ADDRESS: string;

    @Column()
    AGREE_SARARY: string;

    @Column()
    CONFIRMED: string;

    @OneToMany(() => GPUNF_DETAIL, (detail) => detail.unfform)
    details: GPUNF_DETAIL[];

    @OneToOne(() => FORM)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;

    @OneToOne(() => GPUNF_TYPE)
    @JoinColumn({ name: 'REQUEST_TYPE', referencedColumnName: 'RT_ID' })
    requestType: GPUNF_TYPE;
}
