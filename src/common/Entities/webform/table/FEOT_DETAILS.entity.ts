import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity({
    name: 'FEOT_DETAILS',
    schema: 'WEBFORM',
})

export class FEOT_DETAILS{
    @PrimaryColumn()
    PLANYEAR: number;

    @PrimaryColumn()
    PLANMONTH: number;

    @PrimaryColumn()
    SEMPNO: string;

    @PrimaryColumn()
    WORKDATE: Date;

    @Column()
    WORKTIMEIN: string;

    @Column()
    WORKTIMEOUT: string;

    @Column()
    WORKHOURS: number;

    @Column()
    WORKTYPE: number;

    @Column()
    CSTATUS: string;

    @Column()
    WORKDESC: string;
}
