import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { FLOW } from './FLOW.entity';

@Entity({ name: 'STEPMST', schema: 'WEBFORM' })
export class STEPMST {
    @PrimaryColumn()
    CNO: string;

    @Column()
    VNAME: string;

    @Column()
    VDESC: string;

    @OneToMany(() => FLOW, (flow) => flow.steps)
    @JoinColumn([{ name: 'CNO', referencedColumnName: 'CSTEPNO' }])
    step: FLOW[];
}
