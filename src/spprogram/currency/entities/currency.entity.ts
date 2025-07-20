import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('SP_CURRENCY')
export class Currency {
  @PrimaryColumn()
  CURR_YEAR: number;

  @PrimaryColumn()
  CURR_PERIOD: number;

  @PrimaryColumn()
  CURR_CODE: string;

  @Column({ type: 'decimal', precision: 7, scale: 3 })
  CURR_RATE: number;

  @Column()
  CURR_LATEST: string;

  @Column()
  CURR_UPDATE_DATE: Date;

  @Column()
  CURR_UPDATE_BY: string;
}
