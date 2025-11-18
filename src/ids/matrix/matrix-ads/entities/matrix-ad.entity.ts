import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MATRIX_EFFECT_ADS', schema: 'DAILYIDS' })
export class MatrixAd {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  TITLE: string;

  @Column()
  PATHFILE: string;

  @Column()
  USERCREATE: string;

  @Column()
  DATECREATE: Date;
}
