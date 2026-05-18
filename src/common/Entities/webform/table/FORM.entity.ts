import { User } from 'src/amec/users/entities/user.entity';
import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { FORMMST } from './FORMMST.entity';
import { FLOW } from './FLOW.entity';
import { IsForm3 } from 'src/webform/isform/is-form3/entities/is-form3.entity';
import { IsForm4 } from 'src/webform/isform/is-form4/entities/is-form4.entity';
import { IsMo } from 'src/webform/isform/is-mo/entities/is-mo.entity';
import { GpOt } from 'src/webform/gpform/gp-ot/entities/gp-ot.entity';
import { QAINS_FORM } from './QAINS_FORM.entity';

//IS Form

//GP Form

@Entity({ name: 'FORM', schema: 'WEBFORM' })
export class FORM {
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
    VREQNO: string;

    @Column()
    VINPUTER: string;

    @Column()
    VREMARK: string;

    @Column()
    DREQDATE: Date;

    @Column()
    CREQTIME: string;

    @Column()
    CST: string;

    @Column()
    VFORMPAGE: string;

    @Column()
    VREMOTE: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'VINPUTER', referencedColumnName: 'SEMPNO' })
    creator: User;

    @OneToOne(() => FORMMST, (mst) => mst.form)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    ])
    formmst: FORMMST;

    @OneToMany(() => FLOW, (flow) => flow.form)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    flow: FLOW[];

    //GP Form
    @OneToOne(() => QAINS_FORM, (f) => f.FORM)
    QA_INSFORM: QAINS_FORM | null;
}
