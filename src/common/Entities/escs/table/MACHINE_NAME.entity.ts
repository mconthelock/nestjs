import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'MACHINE_NAME', schema: 'ESCCHKSHT' })
export class MACHINE_NAME {
    @PrimaryColumn()
    MC_TYPE: string;

    @PrimaryColumn()
    MC_NO: number;

    @Column()
    MC_DATASOURCE: string;

    @Column()
    MC_NAME: string;
}