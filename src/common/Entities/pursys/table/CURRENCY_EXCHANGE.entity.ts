import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { CurrencyMaster } from './CURRENCY_MASTER.entity';

@Entity({ name: 'CURRENCY_EXCHANGE', schema: 'PURSYS' })
export class CurrencyExchange {
    @PrimaryColumn()
    FYEAR: number;

    @PrimaryColumn()
    PERIOD: number;

    @PrimaryColumn()
    CURR_CODE: string;

    @Column()
    EXRATE: number;

    @Column()
    CREATE_AT: Date;

    @Column()
    CREATE_BY: string;

    @ManyToOne(() => CurrencyMaster, (mst) => mst.CURR_CODE)
    @JoinColumn({ name: 'CURR_CODE', referencedColumnName: 'CURR_CODE' })
    master: CurrencyMaster;
}
