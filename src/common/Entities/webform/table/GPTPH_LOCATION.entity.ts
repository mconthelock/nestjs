import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { GPTPH_AREAS } from './GPTPH_AREAS.entity';

@Entity({
    name: 'GPTPH_LOCATION',
    schema: 'WEBFORM', 
})
export class GPTPH_LOCATION {
    @PrimaryColumn()
    LOCATION_ID: number;
    @Column()
    LOCATION_NAME: string;
    @OneToMany(() => GPTPH_AREAS, (area) => area.LOCATION)
    AREAS: GPTPH_AREAS[];
}    