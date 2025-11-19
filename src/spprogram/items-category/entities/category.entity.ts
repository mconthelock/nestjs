import { Column, Entity, PrimaryColumn, JoinColumn, OneToMany } from 'typeorm';

@Entity('DS_CATEGORY')
export class Category {
  @PrimaryColumn()
  CATE_ID: number;

  @Column()
  CATE_NAME: string;

  @Column()
  CATE_STATUS: number;

  @Column()
  CATE_ITEM: number;
}
