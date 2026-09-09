import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'COUNTRY_ORIGIN_COUNTRY', schema: 'WORKLOAD' })
export class COUNTRY_ORIGIN_COUNTRY {
    @PrimaryColumn()
    BULKCODE: string;

    @PrimaryColumn()
    COUNTRY: string;
}
