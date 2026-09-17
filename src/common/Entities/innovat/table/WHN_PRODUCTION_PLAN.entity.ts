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
    SEQBM: number;

    @Column()
    MFGNO: string;

    @Column()
    ITEMNO: string;

    @Column()
    PACKNO: string;

    @Column()
    PROJ: string;

    @Column()
    MODEL: string;
    
    @Column()
    PARENT_DRAWING: string;

    @Column()
    UPPER_DRAWING: string;

    @Column()
    DRAWING: string;

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