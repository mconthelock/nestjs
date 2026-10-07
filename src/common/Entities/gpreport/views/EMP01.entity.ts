import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'EMP01', schema: 'GPREPORT' })
export class EMP01 {
    @PrimaryColumn()
    EMPCOD: string;

    @Column()
    EMPPRT: string;

    @Column()
    EMPNMT: string;

    @Column()
    EMPPRE: string;

    @Column()
    EMPNME: string;

    @Column()
    EMPSEX: string;

    @Column()
    EMPEDT: string;

    @Column()
    EMPDEP: string;

    @Column()
    DEPART: string;

    @Column()
    POSITN: string;

    @Column()
    INCSLL: string;

    @Column()
    SOSHOS: string;

    @Column()
    BANK: string;

    @Column()
    EMPACN: string;

    @Column()
    PADD1: string;

    @Column()
    PADD2: string;

    @Column()
    PTEL: string;

    @Column()
    PSNAD1: string;

    @Column()
    PSNAD2: string;

    @Column()
    PSNIDN: string;

    @Column()
    PSNBDT: string;

    @Column()
    NATION: string;

    @Column()
    ETHNIC: string;

    @Column()
    RELIGN: string;

    @Column()
    PSNBLD: string;

    @Column()
    DESDST: string;

    @Column()
    PROMDTE: string;
}
