import { ESCSUserAuthorizeView } from 'src/escs/user-authorize-view/entities/user-authorize-view.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'ITEM_STATION',
  schema: 'ESCCHKSHT'
})
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

  @OneToOne(() => ESCSUserAuthorizeView, (s) => s.STATION)
  AUTHORIZE_VIEW: ESCSUserAuthorizeView;
}
