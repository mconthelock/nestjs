import { Entity, Column, PrimaryColumn, OneToMany  } from 'typeorm';
import { Pproduct } from 'src/amec/pproduct/entities/pproduct.entity';
@Entity({
  schema: 'AMEC',
  name: 'PVENDER'
})
export class Pvender {
  @PrimaryColumn()
  SVENDCODE: string;

  @Column()
  STNAME: string;

  @Column()
  SENAME: string;

  @Column()
  STADDRESS: string;

  @Column()
  SEADDRESS: string;

  @Column()
  STELNO: string;

  @Column()
  SFAX: string;

  @Column()
  SCONTACT: string;

  @Column()
  SPOSITION: string;

  @Column()
  STNOTE: string;

  @Column({ type: 'date' })
  DADDDATE: string;  

  @Column()
  SEMPNO: string;

  @Column()
  SSTNAME: string;

  @Column()
  SSENAME: string; 
  
  @Column()
  SEMAIL: string; 

  @Column()
  SCITY: string; 

  @Column()
  SSTATE: string; 

  @Column()
  SPOST: string; 

  @Column()
  SSEARCHKEY: string; 

  @Column()
  SPURADDR1: string; 

  @Column()
  SPURADDR2: string; 

  @Column()
  SPURCITY: string; 

  @Column()
  SPURSTATE: string; 

  @Column()
  SPURPOST: string; 

  @Column()
  SPURCONTACT: string; 

  @Column()
  SPURPHONE: string; 

  @Column()
  SPUREMAIL: string;  

  @Column()
  STERMCODE: string;    

  @Column()
  STERMPAYMENT: string;    

  @Column()
  SSTDCUR: string;    

  @Column()
  CSTATUS: string;  
  
  @Column()
  CSENDSCM: string; 

  @OneToMany(() => Pproduct, (product) => product.vendor)
  products:Pproduct[];

}
