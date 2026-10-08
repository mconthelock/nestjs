import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "FORM_LINK", schema: "WEBFORM"})
export class FORM_LINK{
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VFORM1: string;

    @Column()
    VFORM2: string;

    @Column()
    DREQDATE: Date;
}