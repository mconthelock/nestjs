import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';
import { FORMMST } from './FORMMST.entity';
@Entity({
    name: 'GPRB_STAMP_REQ',
    schema: 'WEBFORM',
})
export class GPRB_STAMP_REQ {
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
    PURPOSE_ID: number;

    @Column()
    PURPOSE_OTHER: string;

    @Column()
    SPOSCODE: string;

    @Column()
    NAME_STAMP: string;

    @Column()
    REMARK: string;

    @Column()
    REQ_TYPE: string;

    @Column()
    REQ_QTY: number;

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
