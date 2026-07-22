import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNWASTE', schema: 'WEBFORM' })
export class RNWASTE {
  @PrimaryColumn()
  WID: number;

  @Column()
  WASTE: string;
}