import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('ESCS_USERS_ITEM')
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
