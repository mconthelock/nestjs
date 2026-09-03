import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PURVMM_FORM } from './PURVMM_FORM.entity';

@Entity({ name: 'PURVMM_SCMUSR', schema: 'WEBFORM' })
export class PURVMM_SCMUSR {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    ID: number;

    @Column()
    NAME: string;

    @Column()
    EMAIL: string;

    @Column()
    USERNAME: string;

    @ManyToOne(() => PURVMM_FORM, (vmm) => vmm.SCMUSER)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    purvmmForm: PURVMM_FORM;
}
