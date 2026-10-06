import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'WTYPE', schema: 'WEBFORM' })
export class WTYPE {
  @PrimaryColumn()
  TID: number;

  @Column()
  TYPENAME: string;
}