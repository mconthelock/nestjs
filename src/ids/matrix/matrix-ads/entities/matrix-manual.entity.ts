import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MATRIX_EFFECT_MANUAL', schema: 'DAILYIDS' })
export class MatrixManual {
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

  @Column()
  USERUPDATE: string;
  
  @Column()
  DATEUPDATE: Date;
}
