import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('EXPAT_TRAVEL')
export class ExpatTravel {
    @PrimaryColumn()
    TRAVEL_ID: number;

    @Column()
    SEMPNO: string;

    @Column()
    FID: number;

    @Column()
    FLIGHT_NO: string;

    @Column()
    FROM_DEST: string;

    @Column()
    DEPARTURE_DATE: Date;

    @Column()
    ARRIVAL_DATE: Date;

    @Column()
    STATUS: string;

    @Column()
    UPDATE_DATE: Date;
}