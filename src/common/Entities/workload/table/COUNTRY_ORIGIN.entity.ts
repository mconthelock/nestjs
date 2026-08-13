import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'COUNTRY_ORIGIN', schema: 'WORKLOAD' })
export class COUNTRY_ORIGIN {
    @PrimaryColumn()
    BULKCODE: string;

    @Column()
    ORIGIN_TYPE: number;

    @Column()
    COUNTRY: string;

    @Column()
    MFG_NAME: string;

    @Column()
    MFG_ADDRESS: string;
}
