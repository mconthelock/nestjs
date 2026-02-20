import { Entity, Column, PrimaryColumn} from 'typeorm';
@Entity({
  schema: 'AMEC',
  name: 'PPRODUCT'
})
export class Pproduct {
  @PrimaryColumn()
  SPRODCODE: string;

  @Column()
  SEXPTYPE: string;

  @Column()
  SVENDCODE: string;

  @Column()
  SPRODID: string;

  @Column()
  STPRODNAME: string;

  @Column()
  SEPRODNAME: string;

  @Column()
  SMODEL: string;  

  @Column()
  STDESC: string;  

  @Column()
  SEDESC: string;  

  @Column()
  SIMAGE: string;  

  @Column({ type: 'date' })
  DADDDATE: string;  

  @Column()
  SEMPNO: string;  

  @Column()
  SCATID: string;  

  @Column()
  SCURCODE: string;  

  @Column()
  SUNITCODE: string;  

  @Column()
  SACCOUNTCODE: string;  

  @Column()
  SACCODE: string;  

  @Column()
  SACCCODE: string; 

  @Column()
  SCATTYPE: string;
  
  @Column()
  SEPRODNAMEN: string;

  @Column()
  SDRAWNUM: string;

  @Column()
  SSPEC: string;

  @Column()
  SCOUNTRY: string;

  @Column()
  SDIMEN: string;

  @Column()
  SBRAND: string;

  @Column()
  SMARKERN: string;

  @Column()
  SLEVEL: string;

  @Column()
  NPRICE: number;

  @Column()
  HAZARDNO: string;

  @Column()
  HAZARDSTATUS: string;

}
