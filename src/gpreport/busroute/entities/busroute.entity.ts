import { Column, Entity, OneToMany, PrimaryColumn, JoinColumn } from 'typeorm';
import { Busstation } from 'src/gpreport/busstation/entities/busstation.entity';

@Entity('BUS_ROUTE')
export class Busroute {
  @PrimaryColumn()
  BUSID: number;

  @Column()
  BUSNAME: string;

  @Column()
  BUSTYPE: string;

  @Column()
  BUSTATUS: string;

  @Column()
  IS_CHONBURI: string;

  @OneToMany(() => Busstation, (stop) => stop.BUSLINE)
  @JoinColumn({ name: 'BUSID', referencedColumnName: 'BUSLINEID' })
  busstation: Busstation[];
}
