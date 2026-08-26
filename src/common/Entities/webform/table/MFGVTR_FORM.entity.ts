import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MFGVTR_DETAIL } from './MFGVTR_DETAIL.entity';

@Entity({ name: 'MFGVTR_FORM', schema: 'WEBFORM' })
export class MFGVTR_FORM {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    NFRMNO: number;

    @Column()
    VORGNO: string;

    @Column()
    CYEAR: string;

    @Column()
    CYEAR2: string;

    @Column()
    NRUNNO: number;

    @Column()
    EMPNO: string;

    @Column()
    CREATED_AT: Date;

    @Column()
    STATUS: string;

    @OneToMany(() => MFGVTR_DETAIL, (detail) => detail.FORM)
    DETAILS: MFGVTR_DETAIL[];
}
