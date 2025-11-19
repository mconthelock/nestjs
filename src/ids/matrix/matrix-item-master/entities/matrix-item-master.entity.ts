import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatrixEffectItem } from '../../matrix-effect-item/entities/matrix-effect-item.entity';
import { MatrixSection } from '../../matrix-section/entities/matrix-section.entity';

@Entity({ name: 'MATRIX_ITEM_MASTER', schema: 'DAILYIDS' })
export class MatrixItemMaster {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  ITEMNO: string;

  @Column()
  TITLE: string;

  @Column()
  STATUS: number;

  @Column()
  SECID: number;

  @Column()
  USERCREATE: string;

  @Column()
  DATECREATE: Date;

  @Column()
  USERUPDATE: string;
  
  @Column()
  DATEUPDATE: Date;

  @OneToMany(() => MatrixEffectItem, (e) => e.MASTER)
  EFFECT: MatrixEffectItem[];

  @OneToOne(() => MatrixSection, (s) => s.MASTER)
  @JoinColumn({ name: 'SECID', referencedColumnName: 'ID' })
  SECTION: MatrixSection;
}
