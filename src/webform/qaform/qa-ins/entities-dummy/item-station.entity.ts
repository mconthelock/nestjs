import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QainsForm } from '../qains_form/entities/qains_form.entity';

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

  @ManyToOne(() => QainsForm, (f) => f.ITEM_STATION)
  @JoinColumn({ name: 'ITS_ITEM', referencedColumnName: 'QA_ITEM' })
  QAINSFORM: QainsForm | null;
}
