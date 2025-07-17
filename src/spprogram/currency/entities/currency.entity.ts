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
  CURR_YEAR: string;

  @PrimaryColumn()
  CURR_PERIOD: string;

  @PrimaryColumn()
  CURR_CODE: string;

  @Column()
  CURR_RATE: string;

  @Column()
  CURR_LATEST: string;

  @Column()
  CURR_UPDATE_DATE: string;

  @Column()
  CURR_UPDATE_BY: string;
}
