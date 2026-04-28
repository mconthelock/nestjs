import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name:"GPRB_PURPOSE",
    schema:"WEBFORM"
})
export class RB_PURPOSE {
    @PrimaryColumn()
    PURPOSE_ID:number;
    @Column()    
    PURPOSE_TH:string;
    @Column()
    PURPOSE_EN:string;
}
