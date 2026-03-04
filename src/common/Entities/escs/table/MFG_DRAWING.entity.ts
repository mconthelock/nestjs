import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { MFG_SERIAL } from './MFG_SERIAL.entity';
import { SYS_STATUS } from './SYS_STATUS.entity';

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
    VFULL_PATH: string;

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

    @OneToMany(() => MFG_SERIAL, (m) => m.MFG_DRAWING)
    MFG_SERIAL: MFG_SERIAL[];

    @ManyToOne(() => SYS_STATUS, (s) => s.MFG_DRAWINGS_INSPECTOR)
    @JoinColumn([
        { name: 'NINSPECTOR_STATUS', referencedColumnName: 'ST_ID' },
        { name: 'VSYSCODE', referencedColumnName: 'ST_CODE' },
    ])
    INSPECTOR_STATUS: SYS_STATUS;

    @ManyToOne(() => SYS_STATUS, (s) => s.MFG_DRAWINGS_FORELEAD)
    @JoinColumn([
        { name: 'NFORELEAD_STATUS', referencedColumnName: 'ST_ID' },
        { name: 'VSYSCODE', referencedColumnName: 'ST_CODE' },
    ])
    FORELEAD_STATUS: SYS_STATUS;

    @ManyToOne(() => SYS_STATUS, (s) => s.MFG_DRAWINGS_DRAWING)
    @JoinColumn([
        { name: 'NSTATUS', referencedColumnName: 'ST_ID' },
        { name: 'VSTATUSCODE', referencedColumnName: 'ST_CODE' },
    ])
    DRAWING_STATUS: SYS_STATUS;
}
