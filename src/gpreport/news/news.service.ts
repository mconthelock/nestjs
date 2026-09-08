import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { News } from 'src/common/Entities/gpreport/table/NEWS.entity';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News, 'gpreportConnection')
        private readonly repo: Repository<News>,
    ) {}

    getAvailable() {
        const today = new Date();
        return this.repo.find({
            where: {
                NEWS_END: MoreThanOrEqual(today),
                NEWS_START: LessThanOrEqual(today),
            },
        });
    }

    findAll() {
        return this.repo.find({ relations: ['attachments'] });
    }
}
