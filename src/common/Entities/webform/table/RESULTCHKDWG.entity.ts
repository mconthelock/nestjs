import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'RESULTCHKDWG', schema: 'WEBFORM' })
export class RESULTCHKDWG {
    // --- Primary Keys ---

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
    DWGNO: string;

    @Column()
    RESULT: number;

    @Column()
    REMARK: string;

    @Column()
    REVNO: string;
}
