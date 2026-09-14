import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'PIS_PAGES', schema: 'WORKLOAD' })
export class PisPages {
    @PrimaryColumn()
    FILES_ID: number;

    @PrimaryColumn()
    PAGE_NUM: number;

    @Column()
    PAGE_MFGNO: string;

    @Column()
    PAGE_PACKING: string;

    @Column()
    PAGE_STATUS: string;
}
