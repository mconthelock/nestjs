import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    JoinColumn,
} from 'typeorm';

@Entity({ name: 'PURPRA_REASON_MASTER', schema: 'WEBFORM' })
export class PURPRA_REASON_MASTER {
    @PrimaryColumn()
    NID: number;

    @Column()
    VGROUP_CODE: string;

    @Column()
    NPARENT_ID: number;

    @Column()
    NSEQ: number;

    @Column()
    VNAME: string;

    @Column()
    VINPUT_TYPE: string;

    @Column()
    VVALUE_TYPE: string;

    @Column()
    NACTIVE: number;

    @ManyToOne(() => PURPRA_REASON_MASTER, (reason) => reason.children)
    @JoinColumn({ name: 'NPARENT_ID' })
    parent: PURPRA_REASON_MASTER;

    @OneToMany(() => PURPRA_REASON_MASTER, (reason) => reason.parent)
    children: PURPRA_REASON_MASTER[];
}
