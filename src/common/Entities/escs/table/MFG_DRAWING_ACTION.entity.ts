import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MFG_DRAWING } from './MFG_DRAWING.entity';
import { SYS_STATUS } from './SYS_STATUS.entity';
import { USERS } from './USERS.entity';

@Entity({ name: 'MFG_DRAWING_ACTION', schema: 'ESCCHKSHT' })
export class MFG_DRAWING_ACTION {
    @PrimaryColumn()
    NDRAWINGID: number;

    @PrimaryColumn()
    NACTION: number;

    @PrimaryColumn()
    VCODEACT: string;

    @PrimaryColumn()
    NSTATUS: number;

    @PrimaryColumn()
    NUSERACT: number;

    @PrimaryColumn()
    DACTDATE: Date;

    @ManyToOne(() => MFG_DRAWING, (d) => d.ACTIONS)
    @JoinColumn({ name: 'NDRAWINGID', referencedColumnName: 'NID' })
    DRAWING: MFG_DRAWING;

    @ManyToOne(() => SYS_STATUS, (s) => s.MFG_DRAWING_ACTION)
    @JoinColumn([
        { name: 'NACTION', referencedColumnName: 'ST_ID' },
        { name: 'VCODEACT', referencedColumnName: 'ST_CODE' },
    ])
    STATUS: SYS_STATUS;

    @ManyToOne(() => USERS, (u) => u.MFG_DRAWING_ACTIONS)
    @JoinColumn({ name: 'NUSERACT', referencedColumnName: 'USR_ID' })
    USERS: USERS;
}
