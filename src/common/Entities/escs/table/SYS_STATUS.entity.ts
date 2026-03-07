import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MFG_DRAWING } from './MFG_DRAWING.entity';
import { MFG_DRAWING_ACTION } from './MFG_DRAWING_ACTION.entity';

@Entity({ name: 'SYS_STATUS', schema: 'ESCCHKSHT' })
export class SYS_STATUS {
    @PrimaryColumn()
    ST_CODE: string;

    @PrimaryColumn()
    ST_ID: number;

    @Column()
    ST_STATUS: string;

    @Column()
    ST_REMARK: string;

    @OneToMany(() => MFG_DRAWING, (m) => m.INSPECTOR_STATUS)
    MFG_DRAWINGS_INSPECTOR: MFG_DRAWING[];

    @OneToMany(() => MFG_DRAWING, (m) => m.FORELEAD_STATUS)
    MFG_DRAWINGS_FORELEAD: MFG_DRAWING[];

    @OneToMany(() => MFG_DRAWING, (m) => m.DRAWING_STATUS)
    MFG_DRAWING: MFG_DRAWING[];

    @OneToMany(() => MFG_DRAWING_ACTION, (m) => m.STATUS)
    MFG_DRAWING_ACTION: MFG_DRAWING_ACTION[];
}
