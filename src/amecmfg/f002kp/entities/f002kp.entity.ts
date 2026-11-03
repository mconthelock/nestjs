import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { F001KP } from '../../f001kp/entities/f001kp.entity';

@Entity({ name: 'F002KP', schema: 'AMECMFG' })
export class F002KP {
    @PrimaryColumn()
    F02R01: string;

    @PrimaryColumn()
    F02R02: number;

    @Column()
    F02R03: string;

    @Column()
    F02R04: number;

    @Column()
    F02R05: number;

    @Column()
    F02R06: string;

    @Column()
    F02R07: number;

    @Column()
    F02R08: string;

    @ManyToOne(() => F001KP, (f1) => f1.process)
    @JoinColumn([{ name: 'F02R01', referencedColumnName: 'F01R01' }])
    tags: F001KP;
}
