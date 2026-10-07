import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'WTYPE_SECPIC', schema: 'WEBFORM' })
export class WTYPE_SECPIC {
  @PrimaryColumn()
  TID: number;

  @PrimaryColumn()
  SECID: number;
}