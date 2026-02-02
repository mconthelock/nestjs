import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PPO', schema: 'AMEC' })
export class PPO {
  @PrimaryColumn()
  SPONO: String;

  @Column()
  DPODATE: Date;

  @Column()
  SREFNO: String;

  @Column()
  SREQUESTER: String;

  @Column()
  SKEY: String;

  @Column()
  SVENDCODE: String;

  @Column()
  SSHIPTO: String;

  @Column()
  SSHIPBY: String;

  @Column()
  SPAYTERM: String;

  @Column()
  STRADETERM: string;

  @Column()
  SDELIVERY: string;

  @Column()
  SBYER: string;

  @Column()
  SACCEPTBY: string;

  @Column()
  DACCEPTDATE: Date;

  @Column()
  CSTATUS: string;

  @Column()
  SCURRENCY: string;

  @Column()
  CINVOICE: string;

  @Column()
  CTAX: string;

  @Column()
  SENAME: string;

  @Column()
  SEADDRESS: string;

  @Column()
  SREF: string;

  @Column()
  CRECEIVE: string;

  @Column()
  CSENTSCM: string;

  @Column()
  DDELIVERY: Date;

  @Column()
  DIMPSCM: Date;

  @Column()
  DSENTSCM: Date;

  @Column()
  CIMPSCMTIME: string;

  @Column()
  CSENTSCMTIME: string;

  @Column()
  SREQUESTDEPT: string;
}
