import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('FLOWMST')
export class Flowmst {
  @PrimaryColumn()
  NFRMNO: number
  
  @PrimaryColumn()
  VORGNO: string
  
  @PrimaryColumn()
  CYEAR: string
  
  @PrimaryColumn()
  CSTEPNO: string
  
  @PrimaryColumn()
  CSTEPNEXTNO: string
  
  @Column()
  VPOSNO: string
  
  @PrimaryColumn()
  VAPVNO: string
  
  @Column()
  VAPVORGNO: string
  
  @Column()
  VURL: string
  
  @Column({default: '0'})
  CSTART: string
  
  @Column()
  CTYPE: string
  
  @Column()
  CEXTDATA: string
  
  @Column({default: '1'})
  CAPVTYPE: string
  
  @Column({default: '1'})
  CREJTYPE: string
  
  @Column({default: '0'})
  CAPPLYALL: string;
}
