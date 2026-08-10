import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BlockMaster } from './APM_MASTER.entity';

@Entity({ name: 'APM_STATION', schema: 'INNOVAT' })
export class BlockStation {
    @PrimaryColumn()
    BLOCKMST: string;

    @PrimaryColumn()
    STN_ID: string;

    @Column()
    STN_GROUP: string;

    @Column()
    STN_CODE: string;

    @Column()
    STN_NAME: string;

    @Column()
    STN_PRIORITY: string;

    @Column()
    STN_PROCESS: string;

    @Column()
    STN_STATUS: string;

    @Column()
    STN_MANPOWER: string;

    @ManyToOne(() => BlockMaster, (master) => master.stations)
    @JoinColumn({ name: 'BLOCKMST', referencedColumnName: 'BLOCK' })
    blockMaster: BlockMaster;
}
