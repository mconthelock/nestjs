import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { FORM } from './FORM.entity';
import { FORMMST } from './FORMMST.entity';

@Entity({
    name: 'GPTPH_REQ_HEADER',
    schema: 'WEBFORM',
})
export class GPTPH_REQ_HEADER {
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
    REQUEST_TYPE: string;
    @Column()
    REQUEST_SUB_TYPE: string;
    @Column()
    PURPOSE: string;
    @Column()
    LONGTERM_YEARS: number;
    @Column()
    PERMIT_START_DATE: Date;
    @Column()
    PERMIT_END_DATE: Date;
    @Column()
    HELMET_STICKER: string;
    @Column()
    PHOTO_PERMIT_BADGE: string;

    @ManyToOne(() => FORMMST)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    ])
    formmaster: FORMMST;

    @ManyToOne(() => FORM)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;
}