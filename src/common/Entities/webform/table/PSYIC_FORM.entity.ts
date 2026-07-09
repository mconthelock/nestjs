import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { INV_YEARLY_RESULT } from '../../skid/table/INV_YEARLY_RESULT.entity';
import { INV_YEARLY_ASSIGN } from '../../skid/table/INV_YEARLY_ASSIGN.entity';

@Entity({ name: 'PSYIC_FORM', schema: 'WEBFORM' })
export class PSYIC_FORM {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    IYA_ID: number;

    @Column()
    CUTOFF_DATE: Date;

    @Column()
    CHECK_DATE: Date;

    @Column()
    FIN_DATE: Date;

    @Column()
    BULK_ITEM: number;

    @Column()
    BULK_AMOUNT: number;

    @Column()
    STOCK_ITEM: number;

    @Column()
    STOCK_AMOUNT: number;

    // join INV_YEARLY_RESULT on IYA_ID
    @OneToMany(() => INV_YEARLY_RESULT, (r) => r.FORM)
    RESULT: INV_YEARLY_RESULT[];

    @OneToOne(() => INV_YEARLY_ASSIGN, (a) => a.FORM)
    ASSIGN: INV_YEARLY_ASSIGN;
}
