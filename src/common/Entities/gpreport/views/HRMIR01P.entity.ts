//HRMIR01P โตเกียวมารีน
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'HRMIR01P', schema: 'GPREPORT' })
export class HRMIR01P {
    @PrimaryColumn()
    IEMP: string;

    @Column()
    IBEN1: string;

    @Column()
    IRE1: string;

    @Column()
    IPER1: string;

    @Column()
    IBEN2: string;

    @Column()
    IRE2: string;

    @Column()
    IPER2: string;

    @Column()
    IBEN3: string;

    @Column()
    IRE3: string;

    @Column()
    IPER3: string;

    @Column()
    IBEN4: string;

    @Column()
    IRE4: string;

    @Column()
    IPER4: string;

    @Column()
    IBEN5: string;

    @Column()
    IRE5: string;

    @Column()
    IPER5: string;

    @Column()
    IUPD: string;
}
