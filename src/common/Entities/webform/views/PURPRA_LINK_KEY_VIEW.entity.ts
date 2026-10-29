import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'PURPRA_LINK_KEY_VIEW', schema: 'WEBFORM'})
export class PURPRA_LINK_KEY_VIEW {
    @PrimaryColumn()
    PNO: string;

    @Column()
    PFRMNO: number;

    @Column()
    PORGNO: string;

    @Column()
    PYEAR: string;

    @Column()
    PYEAR2: string;

    @Column()
    PRUNNO: number;

    @Column()
    CNO: string;

    @Column()
    CYEAR2: string;

    @Column()
    CRUNNO: number;


}