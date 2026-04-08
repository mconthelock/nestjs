import {
    Entity,
    Column,
    PrimaryColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Workplan } from '../../../../docinv/workplan/entities/workplan.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';

@Entity('FORM4')
export class IsForm4 {
    @PrimaryColumn()
    NFRMNO: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: string;

    @Column()
    PLANID: number;

    @Column()
    RESULT: string;

    @Column()
    REASON: string;

    @OneToOne(() => FORM, (form) => form.form1)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;

    @OneToMany(() => FLOW, (flow) => flow.form)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    flow: FLOW[];

    @OneToOne(() => Workplan, (plan) => plan.form4)
    @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
    workplan: Workplan;
}
