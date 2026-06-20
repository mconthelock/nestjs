import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';

import { FINPCK_FORM } from './FINPCK_FORM.entity';
import { FXA_GRPMST } from './FXA_GRMST.entity';


@Entity({ name: 'FINPCK_ASSET', schema: 'WEBFORM' })
export class FINPCK_ASSET {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    ID: number;

    @Column()
    GRPCODE: string;

    @Column()
    ASSETNO: string;

    @Column()
    ASSETDESC: string;

    @Column()
    DOCDATE: Date;

    @Column({ type: 'decimal', precision: 11, scale: 2 })
    INITVAL: number;

    @Column()
    STARTDP: Date;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    MONTHDP: number;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    YTDDP: number;

    @Column({ type: 'decimal', precision: 11, scale: 2 })
    ACCUMDP: number;

    @Column({ type: 'decimal', precision: 11, scale: 2 })
    BOOKVAL: number;

    @Column()
    INVNO: string;

    @Column()
    MODELNO: string;

    @Column()
    SNNO: string;

    @Column()
    PONO: string;

    @Column()
    REFASSET: string;

    @Column()
    VOUCHER: string;

    @Column()
    QTY: number;

    @Column()
    UNIT: string;

    @Column()
    STATUS: string;

    @Column()
    SUPPLIER: string;

    @Column()
    PRNO : string;

    @Column()
    BUDGETNO : string;
    
    @Column()
    REQBY : string;   

    @Column()
    USINGLIFE: number;

    @Column()
    CONFIRM: number;

    @Column()
    NOSTICKER: number;

    @Column()
    LOST: number;

    @Column()
    DAMAGE: number;

    @Column()
    MOVEMNET: number;

    @Column()
    OTHCAUSE: number;
 
    @Column()
    REMOTHCAUSE : string;   

    @Column()
    PIC : string;   

  @ManyToOne(() => FINPCK_FORM, (pckf) => pckf.PCKFORM)
  @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
  @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
  @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
  @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
  @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
  MASTER_PCKFORM: FINPCK_FORM;

  @OneToOne(() => FXA_GRPMST)
  @JoinColumn({ name: 'GRPCODE', referencedColumnName: 'GRPCODE' })
  GRP: FXA_GRPMST;  
}
