import { Column, Entity, PrimaryColumn , OneToMany } from 'typeorm';
import { PAPPSTEP } from './PAPPSTEP.entity';

@Entity({ name: 'PAPPFLOW', schema: 'AMEC' })
export class PAPPFLOW {
    @PrimaryColumn()
    SFLOW: string;

    @Column()
    SLEVEL: string;

    @Column()
    SFLOWDESC: string;
    
    @OneToMany(() => PAPPSTEP, (l) => l.FLOW)
    STEPS: PAPPSTEP[];

}




