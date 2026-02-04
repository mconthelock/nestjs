import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Busroute } from 'src/gpreport/busroute/entities/busroute.entity';
@Entity('BUS_STATION')
export class Busstation {
  @PrimaryColumn()
  STATION_ID: number;

  @Column()
  STATION_NAME: string;

  @Column()
  STATION_STATUS: string;

  @Column()
  BUSLINE: number;

  @Column()
  WORKDAY_TIMEIN: string;

  @Column()
  NIGHT_TIMEIN: string;

  @Column()
  HOLIDAY_TIMEIN: string;

  @ManyToOne(() => Busroute, (busroute) => busroute.station)
  @JoinColumn({ name: 'BUSLINE', referencedColumnName: 'BUSID' })
  route: Busroute;
}
