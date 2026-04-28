import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ORDERS_DRAWING } from './ORDERS_DRAWING.entity';
import { USERS } from './USERS.entity';

@Entity({ name: 'RETURN_APV_LIST', schema: 'ESCCHKSHT' })
export class RETURN_APV_LIST {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VPROD: string;

    @Column()
    VORD_NO: string;

    @Column()
    VITEM: string;

    @Column()
    NDRAWINGID: number;

    @Column()
    NSECID: number;

    @Column()
    NSTATUS: number;

    @Column()
    VREASON: string;

    @Column()
    NUSERCREATE: number;

    @Column()
    DDATECREATE: Date;

    @Column()
    NUSERUPDATE: number;

    @UpdateDateColumn()
    DDATEUPDATE: Date;

    @Column()
    VSTATUSCODE: string;

    @ManyToOne(() => ORDERS_DRAWING)
    @JoinColumn([
        { name: 'VPROD', referencedColumnName: 'ORD_PRODUCTION' },
        { name: 'VORD_NO', referencedColumnName: 'ORD_NO' },
        { name: 'VITEM', referencedColumnName: 'ORD_ITEM' },
        { name: 'NDRAWINGID', referencedColumnName: 'ORDDW_ID' },
    ])
    ordersDrawing: ORDERS_DRAWING;

    @ManyToOne(() => USERS)
    @JoinColumn({ name: 'NUSERCREATE', referencedColumnName: 'USR_ID' })
    userCreate: USERS;
}
