import e from 'express';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';   
import { GPTPH_LOCATION } from './GPTPH_LOCATION.entity';

@Entity({
    name: 'GPTPH_AREAS',
    schema: 'WEBFORM',
})

export class GPTPH_AREAS {
    @PrimaryColumn()
    AREA_ID: number;
    @Column()
    AREA_NAME: string;
    @Column()
    AREA_LEVEL: number;
    @Column()
    LOCATION_ID: number;
    @Column()
    AREA_OWNER: string;
    @Column()
    AREA_OWNER_POSCODE: string;
    @Column()
    AREA_STATUS: string;

    @ManyToOne(() => GPTPH_LOCATION, (location) => location.AREAS)
    @JoinColumn({ name: 'LOCATION_ID', referencedColumnName: 'LOCATION_ID' })
    LOCATION: GPTPH_LOCATION;
}