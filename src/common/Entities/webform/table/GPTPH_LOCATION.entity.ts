import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'GPTPH_LOCATION',
    schema: 'WEBFORM', 
})
export class GPTPH_LOCATION {
    @PrimaryColumn()
    LOCATION_ID: number;
    @Column()
    Location_NAME: string;
}    