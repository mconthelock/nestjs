import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FORMMST', schema: 'WEBFORM' })
export class FORMMST {
    @PrimaryColumn()
    NNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @Column()
    NRUNNO: number;

    @Column()
    VNAME: string;

    @Column()
    VANAME: string;

    @Column()
    VDESC: string;

    @Column()
    DCREDATE: Date;

    @Column()
    CCRETIME: string;

    @Column()
    VAUTHPAGE: string;

    @Column()
    VFORMPAGE: string;

    @Column()
    VDIR: string;

    @Column()
    NLIFETIME: number;

    @Column()
    CSTATUS: string;

    @OneToOne(() => FORM, (form) => form.formmst)
    @JoinColumn([
        { name: 'NNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    ])
    form: FORM;
}
