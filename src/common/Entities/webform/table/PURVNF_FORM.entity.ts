import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PUR_FILE } from './PUR_FILE.entity';

@Entity({ name: 'PURVNF_FORM', schema: 'WEBFORM' })
export class PURNVF_FORM {
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

    @Column()
    REQTYPE: string;

    @Column()
    ATTTYPE: string;

    @Column()
    ATTOTH: string;
    
    @OneToMany(() => PUR_FILE, (s) => s.MASTER)
    FILES: PUR_FILE[];
}
