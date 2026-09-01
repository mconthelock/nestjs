import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AnnualUniform } from './UNIFORM_ANNUAL.entity';
import { UNIFORM } from 'src/common/Entities/gpreport/table/UNIFORM.entity';

@Entity({ name: 'UNIFORM_ANNUAL_DETAIL', schema: 'GPREPORT' })
export class AnnualUniformDetail {
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

    @ManyToOne(() => AnnualUniform, (annual) => annual.details)
    @JoinColumn([
        { name: 'REQL_YEAR', referencedColumnName: 'REQ_YEAR' },
        { name: 'REQL_USER', referencedColumnName: 'REQ_USER' },
    ])
    annual: AnnualUniform;

    @ManyToOne(() => UNIFORM, (u) => u.PROD_ID)
    @JoinColumn([{ name: 'PRODUCT', referencedColumnName: 'PROD_ID' }])
    uniform: UNIFORM;
}
