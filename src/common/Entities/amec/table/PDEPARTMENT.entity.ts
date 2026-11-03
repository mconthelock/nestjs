import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PDEPARTMENT', schema: 'AMEC' })
export class Pdepartment {
    @PrimaryColumn()
    SDEPCODE: string;

    @Column()
    SDEPARTMENT: string;

    @Column()
    SDEPT: string;
}
