import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNCAUSE', schema: 'WEBFORM' })
export class RNCAUSE {
  @PrimaryColumn()
  CID: number;

  @Column()
  CAUSE: string;

  @Column()
  CAUSENAME: string;
}