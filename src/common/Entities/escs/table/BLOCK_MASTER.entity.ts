import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'BLOCK_MASTER', schema: 'ESCCHKSHT' })
export class BLOCK_MASTER {
  @PrimaryGeneratedColumn()
  NID: number;

  @Column()
  VNAME: string;

  @Column()
  VCODE: string;

  @Column()
  NUSERUPDATE: number;

  @Column()
  DDATEUPDATE: Date;

  @Column()
  NSTATUS: number;
}
