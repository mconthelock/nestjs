import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'IDTAG_EFAC_LOG', schema: 'WORKLOAD' })
export class IDTAG_EFAC_LOG {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  CONTROL_NO: string;

  @Column()
  PROCESS_NAME: string;

  @Column()
  MONTH: number;

  @Column()
  YEAR: number;

  @Column()
  RUNNO: number;

  @Column()
  PRINT_DATETIME: Date;

  @Column()
  LOT_NO: string;

  @Column()
  PRINT_BY: string;
}
