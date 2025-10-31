import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { MatrixEffectItem } from '../../matrix-effect-item/entities/matrix-effect-item.entity';
import { MatrixSection } from '../../matrix-section/entities/matrix-section.entity';

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

  @OneToOne(() => MatrixSection, (s) => s.MASTER)
  @JoinColumn({ name: 'SECID', referencedColumnName: 'ID' })
  SECTION: MatrixSection;
}
