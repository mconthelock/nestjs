import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_COUNTRY_CONDITION', schema: 'WORKLOAD' })
export class DPMS_COUNTRY_CONDITION {
    @PrimaryColumn()
    COUNTRY: string;

    @PrimaryColumn()
    TYPE: number;

    @Column()
    CREATEBY: string;

    @Column()
    CREATEDATE: Date;

    @Column()
    UPDATEBY: string;

    @Column()
    UPDATEDATE: Date;
}
