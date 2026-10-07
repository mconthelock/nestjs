import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'UNIFORM_CATEGORY', schema: 'GPREPORT' })
export class UNIFORM_CATEGORY {
    @PrimaryGeneratedColumn()
    CATID: number;

    @Column()
    CATNAME: string;

    @Column()
    CATDESC: string;

    @Column()
    CATANNUAL: string;

    @Column()
    CATIMAGE: string;

    @Column()
    CATUNIT: string;

    @Column()
    CATMETER: string;

    @Column()
    CATSEQ: number;

    @Column()
    CATGROUP: string;

    @Column()
    CATOWNER: string;

    @Column()
    CATREMARK: string;
}
