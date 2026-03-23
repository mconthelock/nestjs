import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PPR } from './PPR.entity';

@Entity({ name: 'PPRBIDDING', schema: 'AMEC' })
export class PPRBIDDING {
    @PrimaryColumn()
    SPRNO: string;

    @Column()
    BIDDINGNO: string;

    @Column()
    EBUDGETNO: string;

    @OneToOne(() => PPR, (ppr) => ppr.PPRBIDDING)
    @JoinColumn({ name: 'SPRNO', referencedColumnName: 'SPRNO' })
    PPR: PPR;
}
