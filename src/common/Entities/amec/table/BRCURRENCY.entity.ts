import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'BRCURRENCY', schema: 'AMEC' })
export class BRCURRENCY {
    @PrimaryColumn()
    CURRYEAR: number;

    @PrimaryColumn()
    CURRSECT: number;

    @Column()
    CURRCODE: string;

    @Column()
    CCURRENCY: number;

    @Column()
    CURRDATE: string;

    @PrimaryColumn()
    CCURNO: number;

    @Column()
    CCURNAME: string;
}
