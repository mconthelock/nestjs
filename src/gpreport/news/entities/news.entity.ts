import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('NEWS')
export class News {
  @PrimaryColumn()
  NEWS_ID: number;

  @Column()
  NEWS_TITLE: string;

  @Column()
  NEWS_START: Date;

  @Column()
  NEWS_END: Date;

  @Column()
  NEWS_IMG: string;

  @Column()
  NEWS_ADDDATE: Date;

  @Column()
  NEWS_ADDBY: string;

  @Column()
  NEWS_UPDATEDATE: Date;

  @Column()
  NEWS_UPDATEBY: string;

  @Column()
  NEWS_DETAIL: string;
}
