import {
    Entity,
    Column,
    PrimaryColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
// import { Workplan } from '../../../../docinv/workplan/entities/workplan.entity';
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

    // @OneToOne(() => Workplan, (plan) => plan.form4)
    // @JoinColumn([{ name: 'PLANID', referencedColumnName: 'PLANID' }])
    // workplan: Workplan;
}
