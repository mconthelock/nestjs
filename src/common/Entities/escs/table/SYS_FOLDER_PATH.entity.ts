import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'SYS_FOLDER_PATH', schema: 'ESCCHKSHT' })
export class SYS_FOLDER_PATH {
  @PrimaryColumn()
  FDP_ID: string;

  @Column()
  FDP_DESCRIPTION: string;

  @Column()
  FDP_DETAIL: string;

  @Column()
  FDP_CODE: string;

  @Column()
  SEC_ID: number;
}