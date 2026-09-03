import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'UNIFORM_ANNUAL', schema: 'GPREPORT' })
export class UNIFORM_ANNUAL {
    @PrimaryColumn()
    REQ_YEAR: number;

    @PrimaryColumn()
    REQ_USER: string;

    @Column()
    CREATE_DATE: string;

    @Column()
    CREATE_BY: string;

    @Column()
    CSTATUS: string;

    @Column()
    REMARK: string;
}
