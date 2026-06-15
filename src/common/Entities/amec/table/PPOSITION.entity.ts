import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PPOSITION', schema: 'AMEC' })
export class PPOSITION {
    @PrimaryColumn()
    SPOSCODE: string;

    @Column()
    SPOSITION: string;

    @Column()
    SPOSNAME: string;

    @Column()
    SSTARTLEVEL: string;
}
