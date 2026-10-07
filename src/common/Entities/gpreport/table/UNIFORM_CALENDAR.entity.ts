import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'UNIFORM_CALENDAR', schema: 'GPREPORT' })
export class UniformCalendar {
    @PrimaryColumn()
    FYEAR: number;

    @Column()
    SDATE: Date;

    @Column()
    EDATE: Date;

    @Column()
    CREATE_AT: Date;

    @Column()
    CREATE_BY: string;

    @Column()
    UPDATE_AT: Date;

    @Column()
    UPDATE_BY: string;
}
