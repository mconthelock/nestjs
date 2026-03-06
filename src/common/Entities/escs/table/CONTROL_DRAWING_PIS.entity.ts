import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ITEM_MFG } from './ITEM_MFG.entity';
@Entity({ name: 'CONTROL_DRAWING_PIS', schema: 'ESCCHKSHT' })
export class CONTROL_DRAWING_PIS {
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

    @ManyToOne(() => ITEM_MFG, (i) => i.CONTROL_LIST)
    @JoinColumn({ name: 'NITEMID', referencedColumnName: 'NID' })
    ITEM: ITEM_MFG;
}
