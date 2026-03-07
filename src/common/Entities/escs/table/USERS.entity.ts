import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { MFG_DRAWING_ACTION } from './MFG_DRAWING_ACTION.entity';

@Entity({
    name: 'USERS',
    schema: 'ESCCHKSHT',
})
export class USERS {
    @PrimaryColumn()
    USR_ID: number;

    @Column()
    USR_NO: string;

    @Column()
    USR_NAME: string;

    @Column()
    USR_EMAIL: string;

    @Column({ type: 'date', insert: false, update: false })
    USR_REGISTDATE: Date;

    @Column()
    USR_USERUPDATE: number;

    @Column({ type: 'date', insert: false, update: false })
    USR_DATEUPDATE: Date;

    @Column()
    GRP_ID: number;

    @Column()
    USR_STATUS: number;

    @Column()
    SEC_ID: number;

    @OneToMany(() => MFG_DRAWING_ACTION, (m) => m.USERS)
    MFG_DRAWING_ACTIONS: MFG_DRAWING_ACTION[];
}
