import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PackingMas' })
export class PackingMas {
    @PrimaryColumn()
    prod: string;

    @PrimaryColumn()
    pri: string;

    @PrimaryColumn()
    orderno: string;

    @PrimaryColumn()
    caseno: string;

    @PrimaryColumn()
    caseqty: number;

    @Column()
    vis: string;

    @Column()
    chkcompte: boolean;

    @Column({ nullable: true })
    chkcomptedate: Date;

    @Column()
    pckcompte: boolean;

    @Column({ nullable: true })
    pckcomptedate: Date;

    @Column()
    upchker: boolean;

    @Column({ nullable: true })
    chkerdate: string;

    @Column()
    updcdate: boolean;

    @Column({ nullable: true })
    dcdate: string;

    @Column()
    firstupdte: Date;

    @Column({ nullable: true })
    eucode: string;
}