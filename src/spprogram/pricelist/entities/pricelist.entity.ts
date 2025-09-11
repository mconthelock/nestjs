import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Items } from '../../items/entities/items.entity';

@Entity('PRICELIST')
export class Pricelist {
  @PrimaryColumn()
  FYYEAR: number;

  @PrimaryColumn()
  PERIOD: string;

  @PrimaryColumn()
  ITEM: number;

  @Column()
  STATUS: string;

  @Column()
  STARTIN: string;

  @Column()
  INQUIRY: number;

  @Column()
  FCCOST: number;

  @Column()
  FCBASE: number;

  @Column()
  TCCOST: number;

  @Column()
  LATEST: string;

  @ManyToOne(() => Items, (item) => item.prices)
  @JoinColumn({ name: 'ITEM', referencedColumnName: 'ITEM_ID' })
  itemdesc: Items;
}
