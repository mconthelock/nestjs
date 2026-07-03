import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DPMS_PL_CASE_LIST_DETAIL } from './DPMS_PL_CASE_LIST_DETAIL.entity';

@Entity({ name: 'DPMS_PL_CASE_LIST', schema: 'WORKLOAD' })
export class DPMS_PL_CASE_LIST {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    NISSUEREV_ID: number;

    @Column()
    VMFGNO: string;

    @Column()
    NSEQ: number;

    @Column()
    VCASE: string;

    @Column()
    VPACKSTYLE: string;

    @Column()
    NNETWEIGHT: number;

    @Column()
    NGROSSWEIGHT: number;

    @Column()
    VWIDTH: string;

    @Column()
    VLENGTH: string;

    @Column()
    VHEIGHT: string;

    @OneToMany(() => DPMS_PL_CASE_LIST_DETAIL, (detail) => detail.MAIN)
    DETAILS: DPMS_PL_CASE_LIST_DETAIL[];
}
