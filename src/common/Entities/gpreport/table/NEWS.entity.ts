import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { NewsFiles } from './NEWS_FILES.entity';

@Entity({ name: 'NEWS', schema: 'GPREPORT' })
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

    @OneToMany(() => NewsFiles, (files) => files.News)
    attachments: NewsFiles[];
}
