import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AMECORDERS_SCHEDULE' })
export class AmecOrdersSchedule {
    @PrimaryColumn()
    REFMFGNO: string;

    @Column()
    DESBM: string;
    @Column()
    DESBM_PLAN: Date;
    @Column()
    DESBM_ACTUAL: Date;

    @Column()
    MFGBM_NO: number;
    @Column()
    MFGBM: string;
    @Column()
    MFGBM_P: string;
    @Column()
    MFGBM_PLAN: Date;
    @Column()
    MFGBM_ACTUAL: Date;

    @Column()
    FEEDER1_PLANDATE: Date;
    @Column()
    FEEDER1_FINDATE: Date;
    @Column()
    FEEDER1_TOTAL: number;
    @Column()
    FEEDER1_ACTUAL: number;

    @Column()
    FEEDER2_PLANDATE: Date;
    @Column()
    FEEDER2_FINDATE: Date;
    @Column()
    FEEDER2_TOTAL: number;
    @Column()
    FEEDER2_ACTUAL: number;

    @Column()
    SUBASSY_PLANDATE: Date;
    @Column()
    SUBASSY_FINDATE: Date;
    @Column()
    SUBASSY_TOTAL: number;
    @Column()
    SUBASSY_ACTUAL: number;

    @Column()
    ASSY_PLANDATE: Date;
    @Column()
    ASSY_FINDATE: Date;
    @Column()
    ASSY_TOTAL: number;
    @Column()
    ASSY_ACTUAL: number;

    @Column()
    INSPECTION_PLANDATE: Date;
    @Column()
    INSPECTION_FINDATE: Date;
    @Column()
    INSPECTION_TOTAL: number;
    @Column()
    INSPECTION_ACTUAL: number;

    @Column()
    PACKING_PLANDATE: Date;
    @Column()
    PACKING_FINDATE: Date;
    @Column()
    PACKING_TOTAL: number;
    @Column()
    PACKING_ACTUAL: number;

    @Column()
    SUBCON_TOTAL: number;
    @Column()
    SUBCON_ACTUAL: number;
    @Column()
    SUBCON_FINDATE: Date;

    @Column()
    VANNING_PLANDATE: Date;
    @Column()
    VANNING_FINDATE: Date;
    @Column()
    VANNING_TOTAL: number;
    @Column()
    VANNING_ACTUAL: number;

    @Column()
    JOPORDER: string;
    @Column()
    ORDSTATUS: number;

    @Column()
    MFG_FINISHDATE: Date;
    @Column()
    LAST_UPDATE: Date;
    @Column()
    SHIPMENT_DATE: Date;
}
