import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { MatrixItemMaster } from '../../matrix-item-master/entities/matrix-item-master.entity';

@Entity({ name: 'MATRIX_SECTION', schema: 'DAILYIDS' })
export class MatrixSection {
  @PrimaryColumn()
  ID: number;

  @Column()
  NAME: string;

  @Column()
  STATUS: number;

  @OneToOne(() => MatrixItemMaster, (m) => m.SECTION)
  MASTER: MatrixItemMaster;
}
