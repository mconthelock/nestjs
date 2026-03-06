import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ITEM_MFG } from './ITEM_MFG.entity';
@Entity({ name: 'ITEM_MFG_DELETE', schema: 'ESCCHKSHT' })
export class ITEM_MFG_DELETE {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    NITEMID: number;

    @Column()
    VDRAWING: string;

    @Column()
    VREMARK: string;

    @Column()
    NSTATUS: number;

    @Column()
    NUSERCREATE: number;

    @Column()
    DDATECREATE: Date;

    @Column()
    NUSERUPDATE: number;

    @Column()
    DDATEUPDATE: Date;

    @ManyToOne(() => ITEM_MFG, (i) => i.DELETE_LIST)
    @JoinColumn({ name: 'NITEMID', referencedColumnName: 'NID' })
    ITEM: ITEM_MFG;
}
