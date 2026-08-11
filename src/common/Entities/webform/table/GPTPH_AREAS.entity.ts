import e from 'express';
import { Column, Entity, PrimaryColumn } from 'typeorm';   

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
}

