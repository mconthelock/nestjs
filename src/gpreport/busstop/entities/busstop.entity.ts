import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BUS_STOP')
export class Busstop {
  //@PrimaryColumn()
  @PrimaryGeneratedColumn('increment')
  STOP_ID: number;

  @Column()
  STOP_NAME: string;

  @Column()
  STOP_STATUS: string;

  @Column()
  WORKDAY_TIMEIN: string;

  @Column()
  NIGHT_TIMEIN: string;

  @Column()
  HOLIDAY_TIMEIN: string;
}
