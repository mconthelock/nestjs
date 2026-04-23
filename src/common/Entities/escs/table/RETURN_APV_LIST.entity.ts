import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ORDERS_DRAWING } from './ORDERS_DRAWING.entity';
import { ORDERS } from './ORDERS.entity';

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
    NUSERCREATE: number;

    @Column()
    DDATECREATE: Date;

    @Column()
    NUSERUPDATE: number;

    @UpdateDateColumn()
    DDATEUPDATE: Date;

    @Column()
    NSECID: number;

    @Column()
    VSTATUSCODE: string;

    @Column()
    NSTATUS: number;

    @OneToOne(() => ORDERS_DRAWING)
    @JoinColumn([
        { name: 'VPROD', referencedColumnName: 'ORD_PRODUCTION' },
        { name: 'VORD_NO', referencedColumnName: 'ORD_NO' },
        { name: 'VITEM', referencedColumnName: 'ORD_ITEM' },
        { name: 'NDRAWINGID', referencedColumnName: 'ORDDW_ID' },
    ])
    ordersDrawing: ORDERS_DRAWING;
}
