import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ESCS_USERS_ITEM_STATION')
export class ESCSUserItemStation {
  @PrimaryColumn()
  US_USER: string;

  @PrimaryColumn()
  US_ITEM: string;

  @PrimaryColumn()
  US_STATION_NO: number;
  
  @Column()
  US_STATION: string;
  
  @Column()
  US_USERUPDATE: string;
  
  @Column()
  US_DATEUPDATE: Date;
  
}
