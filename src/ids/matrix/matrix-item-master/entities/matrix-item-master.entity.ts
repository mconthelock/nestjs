import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { MatrixEffectItem } from '../../matrix-effect-item/entities/matrix-effect-item.entity';

@Entity('MATRIX_ITEM_MASTER')
export class MatrixItemMaster {
  @PrimaryColumn()
  ID: number;

  @Column()
  ITEMNO: string;

  @Column()
  TITLE: string;

  @Column()
  DATECREATE: Date;

  @Column()
  STATUS: number;

  @Column()
  SECID: number;

  @OneToMany(() => MatrixEffectItem, (e) => e.MASTER)
  EFFECT: MatrixEffectItem[];
}
