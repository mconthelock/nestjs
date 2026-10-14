import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_REASON',
    schema: 'INNOVAT',
})
export class WHN_REASON {
    @PrimaryColumn()
    RS_ID: number;

    @Column()
    RS_NAME_TH: string;

    @Column()
    RS_NAME_EN: string;

    @Column()
    RS_STATUS: number;

    @Column()
    RS_CREATE_DATE: Date;
}