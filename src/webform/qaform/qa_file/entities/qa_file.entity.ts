import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('QA_FILE')
export class QaFile {
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

  @Column()
  FILE_ID: number;

  @Column()
  FILE_ONAME: string;

  @Column()
  FILE_FNAME: string;

  @Column()
  FILE_USERCREATE: string;

  @Column()
  FILE_DATECREATE: Date;

  @Column()
  FILE_USERUPDATE: string;

  @Column()
  FILE_DATEUPDATE: Date;

  @Column()
  FILE_TYPECODE: string;

  @Column()
  FILE_TYPENO: number;

  @Column()
  FILE_STATUS: number;

  @Column()
  FILE_PATH: string;
}
