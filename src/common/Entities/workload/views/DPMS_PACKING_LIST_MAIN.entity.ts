import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DPMS_PACKING_LIST_DETAIL } from './DPMS_PACKING_LIST_DETAIL.entity';
import { DPMS_PACKING_LIST_DETAIL_PO } from './DPMS_PACKING_LIST_DETAIL_PO.entity';

@Entity({ name: 'DPMS_PACKING_LIST_MAIN', schema: 'WORKLOAD' })
export class DPMS_PACKING_LIST_MAIN {
    @PrimaryColumn()
    VMFGNO: string;

    @PrimaryColumn()
    VCASE: string;

    @Column()
    VPACKSTYLE: string;

    @Column()
    NNETWEIGHT: string;

    @Column()
    NGROSSWEIGHT: string;

    @Column()
    VWIDTH: string;

    @Column()
    VLENGTH: string;

    @Column()
    VHEIGHT: string;

    @OneToMany(() => DPMS_PACKING_LIST_DETAIL, (detail) => detail.MAIN)
    DETAILS: DPMS_PACKING_LIST_DETAIL[];

    @OneToMany(() => DPMS_PACKING_LIST_DETAIL_PO, (detail) => detail.MAIN)
    DETAILS_PO: DPMS_PACKING_LIST_DETAIL_PO[];
}
