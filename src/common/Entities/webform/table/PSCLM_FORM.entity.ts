import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FORM } from './FORM.entity';
import { FORMMST } from './FORMMST.entity';

@Entity({
    name: 'PSCLM_FORM',
    schema: 'WEBFORM',
})
export class PSCLM_FORM {
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
    NEWORDER: string;

    @Column({ nullable: true })
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
