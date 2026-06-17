import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DPMS_PACKING_LIST_MAIN } from './DPMS_PACKING_LIST_MAIN.entity';

@Entity({ name: 'DPMS_PACKING_LIST_DETAIL', schema: 'WORKLOAD' })
export class DPMS_PACKING_LIST_DETAIL {
    @PrimaryColumn()
    VMFGNO: string;

    @PrimaryColumn()
    VCASE: string;

    @PrimaryColumn()
    VITEM: string;

    @Column()
    VPART: string;

    @PrimaryColumn()
    VDRAWING: string;

    @PrimaryColumn()
    NQTY: string;

    @Column()
    NROUND: number;

    @Column()
    VSELECTED: string;

    @ManyToOne(() => DPMS_PACKING_LIST_MAIN, (main) => main.DETAILS)
    @JoinColumn([
        { name: 'VMFGNO', referencedColumnName: 'VMFGNO' },
        { name: 'VCASE', referencedColumnName: 'VCASE' },
    ])
    MAIN: DPMS_PACKING_LIST_MAIN;
}
