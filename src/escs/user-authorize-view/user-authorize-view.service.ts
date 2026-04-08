import { Injectable } from '@nestjs/common';
import { SearchUserAuthorizeViewDto } from './dto/search-user-authorize-view.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UsersAuthorizeViewRepository } from './user-authorize-view.repository';

@Injectable()
export class UsersAuthorizeViewService {
    constructor(private readonly repo: UsersAuthorizeViewRepository) {}

    async getUserAuthorizeView(
        dto: SearchUserAuthorizeViewDto,
    ) {
        return this.repo.getUserAuthorizeView(dto);
    }
}
