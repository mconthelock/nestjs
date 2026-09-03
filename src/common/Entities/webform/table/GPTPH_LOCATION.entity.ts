import { Column, Entity, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
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
    @JoinColumn({ name: 'LOCATION_ID', referencedColumnName: 'LOCATION_ID' })
    AREAS: GPTPH_AREAS[];
}    