import { Column, Entity, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { Busroute } from './busroute.entity';

@Entity({ name: 'BUS_LINE', schema: 'GPREPORT' })
export class Busline {
  @PrimaryColumn()
  BUSID: number;

  @Column()
  BUSNAME: string;

  @Column()
  BUSTYPE: string;

  @Column()
  BUSSTATUS: string;

  @Column()
  BUSSEAT: number;

  @Column()
  IS_CHONBURI: string;

  @OneToMany(()=> Busroute ,(b) => b.busmaster)
  busmst : Busroute[];


}
