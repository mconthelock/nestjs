import { Injectable } from '@nestjs/common';
import { ESCSSearchUserAuthorizeViewDto } from './dto/search-user-authorize-view.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ESCSUserAuthorizeView } from './entities/user-authorize-view.entity';

@Injectable()
export class ESCSUserAuthorizeViewService {
  constructor(
    @InjectRepository(ESCSUserAuthorizeView, 'amecConnection')
    private userAuthRepo: Repository<ESCSUserAuthorizeView>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  async getUserAuthorizeView(
    dto: ESCSSearchUserAuthorizeViewDto,
    queryRunner?: QueryRunner,
  ) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(ESCSUserAuthorizeView)
      : this.userAuthRepo;
    return repo.find({ where: dto });
  }
}
