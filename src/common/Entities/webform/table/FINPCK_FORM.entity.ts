import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { FINPCK_ASSET } from './FINPCK_ASSET.entity';

@Entity({ name: 'FINPCK_FORM', schema: 'WEBFORM' })
export class FINPCK_FORM {
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
    CCCODE: string;

    @Column()
    CCDESC: string;

    @Column()
    LOCCODE: string;

    @Column()
    LOCNAME: string;

    @OneToMany(() => FINPCK_ASSET, (l) => l.MASTER_PCKFORM)
    ASSETS: FINPCK_ASSET[];
    // @OneToMany(() => PURNVF_ADDRESS, (a) => a.MASTER_NVFADDR)
    // ADDRESSES: PURNVF_ADDRESS[];
}
