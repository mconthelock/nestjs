import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DPMS_PACKING_LIST_MAIN } from './DPMS_PACKING_LIST_MAIN.entity';

@Entity({ name: 'DPMS_PACKING_LIST_DETAIL_PO', schema: 'WORKLOAD' })
export class DPMS_PACKING_LIST_DETAIL_PO {
    @PrimaryColumn()
    RUNNO: number;
    
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
    NQTY: string;

    @Column()
    NROUND: number;

    @Column()
    VISSUE_SELECTED: string;

    @Column()
    NEW_LIST: string;

    @ManyToOne(() => DPMS_PACKING_LIST_MAIN, (main) => main.DETAILS_PO)
    @JoinColumn([
        { name: 'VMFGNO', referencedColumnName: 'VMFGNO' },
        { name: 'VCASE', referencedColumnName: 'VCASE' },
    ])
    MAIN: DPMS_PACKING_LIST_MAIN;
}
