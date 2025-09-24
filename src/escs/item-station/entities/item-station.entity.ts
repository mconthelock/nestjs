import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ESCS_ITEM_STATION')
export class ESCSItemStation {
  @PrimaryColumn()
  ITS_ITEM: string;

  @PrimaryColumn()
  ITS_NO: number;

  @Column()
  ITS_STATION_NAME: string;

  @Column()
  ITS_USERUPDATE: number;

  @Column()
  ITS_DATEUPDATE: Date;
}
