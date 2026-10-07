import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'PART_SHORTAGE_CONTROL', schema: 'SKIDCNTRL' })
export class PART_SHORTAGE_CONTROL {
    @PrimaryColumn()
    CODE: string;

    @Column()
    HIDE_SHORTAGE: string;

    @Column()
    CREATED_BY: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATED_AT: Date;
}