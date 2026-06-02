import { Column, Entity, PrimaryColumn , OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { PAPPFLOW } from './PAPPFLOW.entity';

@Entity({ name: 'PAPPSTEP', schema: 'AMEC' })
export class PAPPSTEP {
    @PrimaryColumn()
    SFLOW: string;

    @PrimaryColumn()
    NSTEP: number;

    @Column()
    SSTEP: string;

    @Column()
    SEMPNO: string;
  
    @Column()
    SDESC: string;

    @Column()
    SEMPAPP: string;

    @ManyToOne(() => PAPPFLOW, (f) => f.STEPS)
    @JoinColumn({ name: 'SFLOW', referencedColumnName: 'SFLOW' })
    FLOW: PAPPFLOW;
}



