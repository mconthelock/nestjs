import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'PSCLM_DETAIL',
    schema: 'WEBFORM',
})
export class PSCLM_DETAIL {
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

    @Column({ nullable: true })
    ORDERNO: string;

    @Column({ nullable: true })
    ITEM: string;

    @Column({ nullable: true })
    PARTNAME: string;

    @Column({ nullable: true })
    DRAWING: string;

    @Column({ nullable: true })
    VARIABLE: string;

    @Column({ nullable: true })
    QTY: number;

    @Column({ nullable: true })
    SCLNO: string;

    @Column({ nullable: true })
    SCLTYPE: string;

    @Column({ nullable: true })
    SCHDNUM: string;

    @Column({ nullable: true })
    SCHDP: string;

    @Column({ nullable: true })
    ISSUETO: string;

    @Column({ nullable: true })
    NEXTPROCESS: string;

    @Column({ nullable: true })
    REMARK: string;
}
