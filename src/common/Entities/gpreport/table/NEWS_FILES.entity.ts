import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { News } from './NEWS.entity';

@Entity({ name: 'NEWS_FILES', schema: 'GPREPORT' })
export class NewsFiles {
    @PrimaryGeneratedColumn()
    FILE_ID: number;

    @Column()
    FILE_NAME: string;

    @Column()
    FILE_FNAME: string;

    @Column()
    NEWS: number;

    @ManyToOne(() => News, (news) => news.attachments)
    @JoinColumn({ name: 'NEWS', referencedColumnName: 'NEWS_ID' })
    News: News;
}
