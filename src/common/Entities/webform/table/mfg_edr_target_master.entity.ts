import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'MFG_EDR_TARGET_MASTER',
    schema: 'WEBFORM',
})
export class MfgEdrTargetMaster {
    @PrimaryColumn({ type: 'decimal', precision: 4 })
    FYEAR: number;

    @PrimaryColumn({ type: 'varchar', length: 6 })
    SSECCODE: string;

    @Column({ type: 'decimal', nullable: true })
    JAN?: number;

    @Column({ type: 'decimal', nullable: true })
    FEB?: number;

    @Column({ type: 'decimal', nullable: true })
    MAR?: number;

    @Column({ type: 'decimal', nullable: true })
    APR?: number;

    @Column({ type: 'decimal', nullable: true })
    MAY?: number;

    @Column({ type: 'decimal', nullable: true })
    JUN?: number;

    @Column({ type: 'decimal', nullable: true })
    JUL?: number;

    @Column({ type: 'decimal', nullable: true })
    AUG?: number;

    @Column({ type: 'decimal', nullable: true })
    SEP?: number;

    @Column({ type: 'decimal', nullable: true })
    OCT?: number;

    @Column({ type: 'decimal', nullable: true })
    NOV?: number;

    @Column({ type: 'decimal', nullable: true })
    DEC?: number;
}
