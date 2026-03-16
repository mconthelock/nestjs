import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { MFG_DRAWING } from './MFG_DRAWING.entity';

@Entity({ name: 'MFG_SERIAL', schema: 'ESCCHKSHT' })
export class MFG_SERIAL {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    NDRAWINGID: number;

    @Column()
    VSERIALNO: string;

    @Column()
    NTYPE: number;

    @Column()
    NUSERCREATE: number;

    @Column()
    DDATECREATE: Date;

    @Column()
    NSTATUS: number;

    @Column()
    NUSERUPDATE: number;

    @Column()
    DDATEUPDATE: Date;

    @ManyToOne(() => MFG_DRAWING, (m) => m.MFG_SERIAL)
    @JoinColumn({ name: 'NDRAWINGID', referencedColumnName: 'NID' })
    MFG_DRAWING: MFG_DRAWING;
}
