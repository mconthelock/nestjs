import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Buspassenger } from './buspassenger.entity';
import { Busroute } from './busroute.entity';

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

  @OneToMany(() => Buspassenger, (b) => b.stop)
  @JoinColumn ({name: 'STOP_ID', referencedColumnName : 'BUSSTOP'})
  passenger : Buspassenger;

  @ManyToOne(() => Busroute, (b) => b.route)
  @JoinColumn ({name: 'STOP_ID', referencedColumnName : 'STOPNO'})
  routed : Busroute;
}
