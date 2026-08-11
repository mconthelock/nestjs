import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity({ name: 'CURRENCY_MASTER', schema: 'PURSYS' })
export class CurrencyMaster {
    @Column()
    CURR_CODE: string;

    @Column()
    CURR_NAME: string;

    @Column()
    CURR_STATUS: string;

    @Column()
    CURR_MAP: string;
}
