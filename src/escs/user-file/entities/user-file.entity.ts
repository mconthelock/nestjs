import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: 'USERS_FILES',
  schema: 'ESCCHKSHT'
})
export class ESCSUserFile {

    @PrimaryColumn()
    UF_ITEM: string;

    @PrimaryColumn()
    UF_STATION: number;

    @PrimaryColumn()
    UF_USR_NO: string;

    @PrimaryColumn()
    UF_ID: number;

    @Column()
    UF_ONAME: string;

    @Column()
    UF_FNAME: string;

    @Column()
    UF_STATUS: number;

    @Column()
    UF_PATH: string;
}
