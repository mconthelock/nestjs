import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_PRODUCTION_PLAN',
    schema: 'INNOVAT',
})
export class WHN_PRODUCTION_PLAN {
    @PrimaryColumn()
    CTRLNO: string;

    @PrimaryColumn()
    PROCESS: string;

    @Column()
    PROD: string;

    @Column()
    P: string;

    @Column()
    MFGNO: string;

    @Column()
    PROJ: string;

    @Column()
    MODEL: string;

    @Column()
    DWG: string;

    @Column()
    QTY: number;

    @Column()
    MATERIAL: string;

    @Column()
    ITEMCODE: string;

    @Column()
    CUT: number;

    @Column()
    REMARK: string;
}