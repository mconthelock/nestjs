import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { AnnualUniformDetail } from './UNIFORM_ANNUAL_DETAIL.entity';

@Entity({ name: 'UNIFORM_ANNUAL', schema: 'GPREPORT' })
export class AnnualUniform {
    @PrimaryColumn()
    REQ_YEAR: number;

    @PrimaryColumn()
    REQ_USER: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    CREATE_BY: string;

    @Column()
    CSTATUS: string;

    @Column()
    REMARK: string;

    @OneToMany(() => AnnualUniformDetail, (d) => d.annual)
    @JoinColumn([
        { name: 'REQ_YEAR', referencedColumnName: 'REQL_YEAR' },
        { name: 'REQ_USER', referencedColumnName: 'REQL_USER' },
    ])
    details: AnnualUniformDetail[];
}
