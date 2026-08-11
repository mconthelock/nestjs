import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PUREVA_FORM } from './PUREVA_FORM.entity';

@Entity({ name: 'PUREVA_SCORE', schema: 'WEBFORM' })
export class PUREVA_SCORE {

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
    EVAID: number;

    @Column()
    TOPIC: string;

    @Column()
    TOPIC_DESC: string;

    @Column({ type: 'number', precision: 2, scale: 0 })
    SCORE: number;

    @Column()
    SLEVEL: string;

   

    @ManyToOne(() => PUREVA_FORM, (eva) => eva.SCORES)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    Scores: PUREVA_FORM;


}