import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PUREVA_FORM } from './PUREVA_FORM.entity';

@Entity({ name: 'PUREVA_VENDOR_RELATION', schema: 'WEBFORM' })
export class PUREVA_VENDOR_RELATION {
    // --- Primary Keys (Composite Key 6 ตัว) ---

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
    ENTITY_TYPE: string;

    @Column()
    ENTITY_NAME: string;

    @Column({ type: 'decimal', precision: 3, scale: 0 })
    PERCENT: number;

    @ManyToOne(() => PUREVA_FORM, (eva) => eva.RELATIONS)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    Relations: PUREVA_FORM;
}
