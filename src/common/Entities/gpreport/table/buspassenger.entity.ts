import { User } from 'src/amec/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Busroute } from './busroute.entity';
import { Busstop } from './busstop.entity';

@Entity({name: 'BUS_PASSENGER', schema: 'GPREPORT'})
export class Buspassenger {
  @PrimaryColumn()
  EMPNO: string;

  @PrimaryColumn()
  STATENO: number;

  @Column()
  BUSSTOP: number;

  @Column()
  UPDATE_DATE: Date;

  @Column()
  UPDATE_BY: string;

  @OneToOne(() => User, (amecuser) => amecuser.BUSPASSENGER)
  @JoinColumn( {name: 'EMPNO', referencedColumnName: 'SEMPNO'})
  Amecuserall:User

  @ManyToOne(() => Busstop, (b) => b.passenger)
  @JoinColumn ({name: 'BUSSTOP', referencedColumnName : 'STOP_ID'})
  stop : Busstop;
}
