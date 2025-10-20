import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('ESCS_USERS_SECTION')
export class UserSection {
  @PrimaryColumn()
  SEC_ID: number;

  @Column()
  SEC_NAME: string;

  @Column({default: 1})
  SEC_STATUS: number;

  @Column()
  INCHARGE: string;

  @Column()
  SSECCODE: string;
}
