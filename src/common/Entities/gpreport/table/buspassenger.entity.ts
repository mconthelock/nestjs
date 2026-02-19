import { User } from 'src/amec/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn  } from 'typeorm';
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


  @UpdateDateColumn({
    name: 'UPDATE_DATE',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  UPDATE_DATE: Date;


  @Column()
  UPDATE_BY: string;



  @ManyToOne(() => Busstop, (b) => b.passenger)
  @JoinColumn ({name: 'BUSSTOP', referencedColumnName : 'STOP_ID'})
  stop : Busstop;
/*
  @ManyToOne(() => User)
  @JoinColumn({ name: 'EMPNO', referencedColumnName: 'SEMPNO' })
  Amecuserall: User;
*/

  @ManyToOne(() => User, (user) => user.BUSPASSENGER)
  @JoinColumn({ name: 'EMPNO', referencedColumnName: 'SEMPNO' })
  Amecuserall: User;
}
