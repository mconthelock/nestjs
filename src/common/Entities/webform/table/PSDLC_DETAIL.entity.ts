import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({
    name: 'PSDLC_DETAIL',
    schema: 'WEBFORM',
})
export class PSDLC_DETAIL {
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

    @PrimaryColumn()
    SEQNO: number;

    @Column()
    DRAWING: string;

    @Column()
    ITEM: string;

    @Column()
    NEWCODE: string;

    @Column()
    NEWFLAG: string;

    @Column()
    OLDCODE: string;

    @Column()
    OLDFLAG: string;

    @Column()
    OLDSTATUS: number;

    @Column()
    OLDSPEC: string;

    @Column()
    REFERENCE: number;

    @Column()
    REMARK: string;

}
