import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'VENDING_USER', schema: 'SKIDCNTRL'})
export class VENDING_USER {
    @PrimaryColumn()
    EMPNO: string;

    @Column()
    STATUS: number;

    @Column()
    CREATED_AT: Date;

    @Column()
    CREATED_BY: string;

    @Column()
    UPDATED_AT: Date;

    @Column()
    UPDATED_BY: string;
}