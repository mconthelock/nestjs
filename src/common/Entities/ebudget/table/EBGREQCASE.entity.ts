import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EBGREQCASE', schema: 'EBUDGET' })
export class EBGREQCASE {
  @PrimaryColumn()
  ID: number;

  @Column()
  CASE: string;
}
