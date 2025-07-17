import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_QUOTATION_TYPE')
export class QuotationType {
  @PrimaryColumn()
  QUOTYPE_ID: string;

  @Column()
  QUOTYPE_DESC: string;

  @Column()
  QUOTYPE_STATUS: string;

  @Column()
  QUOTYPE_CUR: string;
}
