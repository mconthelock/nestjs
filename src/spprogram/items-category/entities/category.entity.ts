import { Column, Entity, PrimaryColumn, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'DS_CATEGORY', schema: 'SPSYS' })
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
