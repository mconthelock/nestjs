import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PUR_FILE } from './PUR_FILE.entity';
import { PURNVF_LIST } from './PURNVF_LIST.entity';
import { PURNVF_ADDRESS } from './PURNVF_ADDRESS.entity';

@Entity({ name: 'PURNVF_FORM', schema: 'WEBFORM' })
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
    ATTACH_TYPE: string;

    @Column()
    ATTACH_OTHER: string;

    @OneToMany(() => PUR_FILE, (s) => s.MASTER)
    FILES: PUR_FILE[];

    @OneToMany(() => PURNVF_LIST, (l) => l.MASTER_NVFLIST)
    LISTS: PURNVF_LIST[];

    @OneToMany(() => PURNVF_ADDRESS, (a) => a.MASTER_NVFADDR)
    ADDRESSES: PURNVF_ADDRESS[];
}
