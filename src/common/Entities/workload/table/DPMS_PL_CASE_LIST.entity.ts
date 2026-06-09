import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
