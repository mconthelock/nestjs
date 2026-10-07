import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
@Entity({ name: 'TERM_TRADE', schema: 'PURSYS' })
export class TermTrade {
    @PrimaryColumn()
    TRADE_CODE: string;

    @Column()
    TRADE_NAME: string;

    @Column()
    TRADE_SHIPTO: string;

    @Column()
    TRADE_SHIPBY: string;

    @Column()
    TRADE_STATUS: string;
}
