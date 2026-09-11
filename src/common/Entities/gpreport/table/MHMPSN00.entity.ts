//Personnel Inf. Physical File
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'MHMPSN00', schema: 'AMECMFG' })
export class MHMPSN00 {
    @PrimaryColumn()
    EMPCOD: string;

    @Column()
    EMPTYP: string;

    @Column()
    PSNAD1: string;

    @Column()
    PSNAD2: string;

    @Column()
    PSNPRV: string;

    @Column()
    PSNZIP: string;

    @Column()
    PSNTEL: string;

    @Column()
    PSNNAT: string;

    @Column()
    PSNETH: string;

    @Column()
    PSNREL: string;

    @Column()
    PSNBLD: string;

    @Column()
    PSNBDT: string;

    @Column()
    PSNIDN: string;

    @Column()
    PSNEDU: string;

    @Column()
    PSNHHT: string;

    @Column()
    PSNWHT: string;

    @Column()
    PSNRNO: string;

    @Column()
    PSNLAN: string;

    @Column()
    EMPLST: string;

    @Column()
    EMPUSR: string;

    @Column()
    PADD1: string;

    @Column()
    PADD2: string;

    @Column()
    PTEL: string;

    @Column()
    PIDDTE: string;
}
