import {
    Entity,
    Column,
    PrimaryColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
// import { Workplan } from '../../../../docinv/workplan/entities/workplan.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Entity('FORM3')
export class IsForm3 {
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
    OPRFILE: string;

    @Column()
    SPECFILE: string;

    @Column()
    PLAN_ID: number;

    @Column({ name: 'PLAN_ID' })
    PLANID: number;

    //   @OneToOne(() => Workplan, (plan) => plan.form3)
    //   @JoinColumn([{ name: 'PLAN_ID', referencedColumnName: 'PLANID' }])
    //   workplan: Workplan;
}
