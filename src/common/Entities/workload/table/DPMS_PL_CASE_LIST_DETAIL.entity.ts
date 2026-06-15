import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_CASE_LIST_DETAIL', schema: 'WORKLOAD' })
export class DPMS_PL_CASE_LIST_DETAIL {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    NCASELIST_ID: number;

    @Column()
    VMFGNO: string;

    @Column()
    VCASE: string;

    @Column()
    VITEM: string;

    @Column()
    VPART: string;

    @Column()
    VDRAWING: string;

    @Column()
    NQTY: number;
}
