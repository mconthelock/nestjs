import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { PURCPC_DETAILS } from './PURCPC_DETAILS.entity';

@Entity({ name: 'PURCPC_FORM', schema: 'WEBFORM' })
export class PURCPC_FORM {
    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    VREQNO: string;

    @Column()
    VINPUTER: string;

    @Column()
    NFUNCTIONS: number;

    @Column()
    CMODE: string;

    @Column()
    NTOTAL_PRES: number;

    @Column()
    NTOTAL_NEW: number;

    @Column()
    NTOTAL_COST: number;

    @Column()
    NTOTAL_RATIO: number;

    @Column()
    VVENDOR: string;
    
    @Column()
    DREQDATE: Date;

    @Column()
    NSTATUS: number;

    @OneToMany(() => PURCPC_DETAILS, detail => detail.PURCPC_FORM)
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    DETAILS: PURCPC_DETAILS[];
}
