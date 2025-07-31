import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('REP')
export class Rep {
    @PrimaryColumn()
    VEMPNO: string;
    
    @Column()
    VREPNO: string;
    
    @PrimaryColumn()
    NFRMNO: number;
    
    @PrimaryColumn()
    VORGNO: string;
    
    @PrimaryColumn()
    CYEAR: string;
    
}
