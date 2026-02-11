import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'BLOCK_MASTER', schema: 'ESCCHKSHT' })
export class BlockMaster {
  @PrimaryColumn()
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
