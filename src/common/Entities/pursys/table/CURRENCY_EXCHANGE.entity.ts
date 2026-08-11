import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';
import { CurrencyMaster } from './CURRENCY_MASTER.entity';

@Entity({ name: 'CURRENCY_EXCHANGE', schema: 'PURSYS' })
export class CurrencyExchange {
    @Column()
    FYEAR: number;

    @Column()
    PERIOD: number;

    @Column()
    CURR_CODE: string;

    @Column()
    EXRATE: number;

    @Column()
    CREATE_AT: Date;

    @Column()
    CREATE_BY: string;

    @ManyToOne(() => CurrencyMaster, (mst) => mst.CURR_CODE)
    master: CurrencyMaster;
}
