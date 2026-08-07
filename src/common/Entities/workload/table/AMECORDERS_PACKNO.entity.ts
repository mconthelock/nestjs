import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'AMECORDERS_PACKNO', schema: 'WORKLOAD' })
export class AmecOrdersPackNo {
    @PrimaryColumn()
    ORDERNO: string;

    @PrimaryColumn()
    PACKNO: string;

    @Column()
    PACKSHOP: string;

    @Column()
    SHIPFORM: string;

    @Column()
    BLOCK: string;

    @Column()
    SECT: string;

    @Column()
    BLOCK_PACKING: string;

    @Column()
    SECT_PACKING: string;
}
