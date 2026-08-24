import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'UNIFORM_ANNUAL_DETAIL', schema: 'GPREPORT' })
export class UNIFORM_ANNUAL_DETAIL {
    @PrimaryColumn()
    REQL_YEAR: number;

    @PrimaryColumn()
    REQL_USER: string;

    @PrimaryColumn()
    PRODUCT: number;

    @Column()
    REQUEST_QTY: number;

    @Column()
    REMARK: string;

    @Column()
    ADJUST: string;

    @Column()
    EXTRA: string;

    @Column()
    DISCOUNT: number;
}
