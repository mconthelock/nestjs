import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FORMMST } from './FORMMST.entity';
import { FORM } from './FORM.entity';

@Entity({
    name: 'PSRP_FORM',
    schema: 'WEBFORM',
})
export class PSRP_FORM {
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
    REQ_TYPE: number;

    @Column()
    REMARK: string;

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
