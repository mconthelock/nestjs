//MHMPRF00 กองทุนสำรองเลี้ยงชีพ
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'MHMPRF00', schema: 'GPREPORT' })
export class MHMPRF00 {
    @PrimaryColumn()
    PRFCOD: string;

    // @Column()
    // PRFAPD: string;

    // @Column()
    // PRFEXD: string;

    // @Column()
    // PRFSTA: string;

    // @Column()
    // PRFTID: string;

    @Column()
    PRFPEP: string;

    // @Column()
    // PRFECA: string;

    // @Column()
    // PRFCEM: string;

    // @Column()
    // PRFPEM: string;

    // @Column()
    // PRFAEA: string;

    // @Column()
    // PRFPLN: string;

    @Column()
    PRFPCP: string;

    // @Column()
    // PRFCCA: string;

    // @Column()
    // PRFCCM: string;

    // @Column()
    // PRFPCM: string;

    // @Column()
    // PRFACA: string;

    @Column()
    PRFBN1: string;

    @Column()
    PRFBP1: string;

    @Column()
    PRFBN2: string;

    @Column()
    PRFBP2: string;

    @Column()
    PRFBN3: string;

    @Column()
    PRFBP3: string;

    @Column()
    PRFBN4: string;

    @Column()
    PRFBP4: string;

    @Column()
    PRFBN5: string;

    @Column()
    PRFBP5: string;

    // @Column()
    // PRFCDT: string;

    // @Column()
    // PRFLST: string;

    // @Column()
    // PRFUSR: string;
}
