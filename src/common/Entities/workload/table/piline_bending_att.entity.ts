import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PILINE_BENDING_MAIN', schema: 'WORKLOAD' })
export class piline_bending_att {
  @PrimaryColumn()
  IDTAG: string;

  @Column({ name: 'ID', nullable: true })
  ID: number;

  @Column({ nullable: true })
  FILE_NAME: string;
}