import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
@Entity({ name: 'FINDS_DUTY_STAMP', schema: 'WEBFORM' })
export class DSDUTYSTAMP {
    @PrimaryColumn()
    DUTY_VALUE: number;

    @Column()
    ACTIVE: string;

}
    