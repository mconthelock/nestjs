import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'J002MP', schema: 'AMECMFG' })
export class J002MP {
    @PrimaryColumn()
    J2ODR: string; 

    @PrimaryColumn()
    J2SEQ: number; 

    @PrimaryColumn()
    J2INO: string; 

    @PrimaryColumn()
    J2IINO: string; 

    @PrimaryColumn()
    J2CUS: string; 

    @Column()
    J2PART: string; 

    @Column()
    J2TO: string; 

    @Column()
    J2MTH: string; 

    @Column()
    J2RQTY: number; 

    @Column()
    J2CQTY: number; 

    @Column()
    J2IQTY: number; 

    @Column()
    J2DES: string; 

    @Column()
    J2LOCC: string; 

    @Column()
    J2LOCN: string; 

    @Column()
    J2LOCA: string; 

    @Column()
    J2STD: string; 

    @Column()
    J2DIM: string; 

    @Column()
    J2RAW: string; 

    @Column()
    J2ART: string; 

    @Column()
    J2UM: string; 

    @Column()
    J2IDTE: string; 

    @Column()
    J2NDTE: string; 

    @Column()
    J2DRAW: string; 

    @Column()
    J2ITM: string; 

    @Column()
    J2CLS: string; 

    @Column()
    J2EFF: number; 

    @Column()
    J2PAT: string; 
}
