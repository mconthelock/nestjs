import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from 'src/common/Entities/gpreport/table/NEWS.entity';
import { NewsFiles } from 'src/common/Entities/gpreport/table/NEWS_FILES.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([News, NewsFiles], 'gpreportConnection'),
    ],
    controllers: [NewsController],
    providers: [NewsService],
})
export class NewsModule {}
