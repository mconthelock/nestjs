import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: 'USERS_ITEM',
  schema: 'ESCCHKSHT'
})
export class ESCSUserItem {
    
    @PrimaryColumn()
    USR_NO: string;
    
    @PrimaryColumn()
    IT_NO: string;

    @Column()
    UI_FFILE: string;

    @Column()
    UI_OFILE: string;

    @Column()
    UI_USERUPDATE: string;

    @Column()
    UI_DATEUPDATE: Date;
}
