import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ITEM_MFG } from "./ITEM_MFG.entity";

@Entity({ name: 'ITEM_STATUS', schema: 'ESCCHKSHT' })
export class ITEM_STATUS {
    @PrimaryColumn()
    NSTATUS: number;

    @Column()
    VDESCRIPTION: string;

    @Column()
    DDATECREATE: Date;

    @OneToMany(() => ITEM_MFG, (i) => i.ITEM_STATUS)
    ITEM_MFG: ITEM_MFG[];
}