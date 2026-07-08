import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { DPMS_PL_CASE_LIST } from './DPMS_PL_CASE_LIST.entity';

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
    VDRAWINGL: string;

    @Column()
    NQTY: number;

    @ManyToOne(() => DPMS_PL_CASE_LIST, (main) => main.DETAILS)
    @JoinColumn([
        { name: 'NCASELIST_ID', referencedColumnName: 'NID' },
    ])
    MAIN: DPMS_PL_CASE_LIST;
}
