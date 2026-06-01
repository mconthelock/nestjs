
import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity({name:'GPGAR_FORM',schema:'WEBFORM'})
export class GPGAR_FORM{
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    CATEGORY_CODE: number;

    @Column()
    REMARK: string;
    
    @Column()
    REQDATE: Date;
}