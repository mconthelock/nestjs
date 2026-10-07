import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'OPDRIGHT', schema: 'WEBFORM' })
export class OPDRIGHT {
    @PrimaryColumn()
    SEMPNO: string;

    @PrimaryColumn()
    OPDYEAR: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    OPDRIGHT: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    OPDREMAIN: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    OPDADD: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    OPDADD_REMAIN: number;
}
