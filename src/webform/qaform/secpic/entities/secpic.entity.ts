import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'SECPIC', schema: 'WEBFORM' })
export class SECPIC {
  @PrimaryColumn()
  SECID: number;

  @Column()
  SECCODE: string;

  @Column()
  SEC: string;

  @Column()
  REJECTNO: string;
}