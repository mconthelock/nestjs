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

  @Column('decimal', { precision: 10, scale: 2 })
  FCCOST: number;

  @Column('decimal', { precision: 10, scale: 2 })
  FCBASE: number;

  @Column('decimal', { precision: 10, scale: 2 })
  TCCOST: number;

  @Column()
  LATEST: string;

  @ManyToOne(() => Items, (item) => item.prices)
  @JoinColumn({ name: 'ITEM', referencedColumnName: 'ITEM_ID' })
  itemdesc: Items;
}
