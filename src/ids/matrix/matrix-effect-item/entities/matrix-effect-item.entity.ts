import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MatrixItemMaster } from '../../matrix-item-master/entities/matrix-item-master.entity';

@Entity({ name: 'MATRIX_EFFECT_ITEM', schema: 'DAILYIDS' })
export class MatrixEffectItem {
  @PrimaryColumn()
  ITEM_ID: number;

  @PrimaryColumn()
  EFFECT_ID: number;

  @Column()
  DATECREATE: Date;

  @Column()
  USERCREATE: string;

  @ManyToOne(() => MatrixItemMaster, (m) => m.EFFECT)
  @JoinColumn({ name: 'ITEM_ID', referencedColumnName: 'ID' })
  MASTER: MatrixItemMaster;
}
