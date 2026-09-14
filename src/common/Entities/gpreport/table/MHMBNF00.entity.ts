//Cremation fund->Beneficiary Information
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'MHMBNF00', schema: 'AMECMFG' })
export class MHMBNF00 {
    @PrimaryColumn()
    EMPCOD: string;

    @PrimaryColumn()
    BNFNME: string;

    @Column()
    BNFREL: string;

    @Column()
    BNFPER: number;

    @Column()
    BNFLST: number;

    @Column()
    BNFUSR: string;
}
