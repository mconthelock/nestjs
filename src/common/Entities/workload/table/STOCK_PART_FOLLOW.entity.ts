import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STOCK_PART_FOLLOW', schema: 'WORKLOAD' })
export class STOCK_PART_FOLLOW {
    @PrimaryColumn()
    ITEM: string;

    @PrimaryColumn()
    DRAWING: string;

    @PrimaryColumn()
    PROD: string;

    @PrimaryColumn()
    IDTAG: string;

    @PrimaryColumn()
    PROCESS: string;

    @Column()
    PLAN: Date;

    @Column()
    REMARK: string;
}
