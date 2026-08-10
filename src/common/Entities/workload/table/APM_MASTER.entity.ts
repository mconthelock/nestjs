import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { BlockStation } from './APM_STATION.entity';

@Entity({ name: 'APM_MASTER', schema: 'INNOVAT' })
export class BlockMaster {
    @PrimaryColumn()
    BLOCK: string;

    @Column()
    NAME: string;

    @Column()
    SECTION: string;

    @Column()
    DESCRIPTION: string;

    @OneToMany(() => BlockStation, (station) => station.blockMaster)
    stations: BlockStation[];
}
