import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Timestamp } from 'typeorm';
import { FORMMST } from './FORMMST.entity';
import { FORM } from './FORM.entity';

@Entity({
    name: 'PSDLC_FORM',
    schema: 'WEBFORM',
})
export class PSDLC_FORM {
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
    CHANGE_DATE: Date;

    @Column()
    CHANGE_SCHD: string;

    @Column()
    CHANGE_STATUS: string;

    @Column({type: 'timestamp', nullable: true})
    ACTUAL_DATE: Date;

    @Column()
    ACTUAL_UPDATEBY: string;

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
