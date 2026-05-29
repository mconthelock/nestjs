import { Column, Entity, PrimaryColumn } from "typeorm";
@Entity({name:'GPGAR_CATEGORY',schema:'WEBFORM'})
export class GPGAR_CATEGORY{
    @PrimaryColumn()
    CATEGORY_CODE : Number;

    @Column()
    CATEGORY_NAME : String;

    @Column()
    ACTIVE : String;
}