import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity({ name: 'MFG_DRAWING', schema: 'ESCCHKSHT' })
export class MFG_DRAWING {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    NBLOCKID: number;

    @Column()
    NITEMID: number;

    @Column()
    VPIS: string;

    @Column()
    VDRAWING: string;

    @Column()
    VSYSCODE: string;

    @Column()
    NINSPECTOR_STATUS: number;

    @Column()
    NFORELEAD_STATUS: number;

    @Column()
    VFILE_NAME: string;

    @Column()
    VSTATUSCODE: string;

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
}
