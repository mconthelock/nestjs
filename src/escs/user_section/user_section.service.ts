import { Injectable } from '@nestjs/common';
import { SearchUsersSectionDto } from './dto/search-escs-usersection.dto';
import { UsersSectionRepository } from './user_section.repository';

@Injectable()
export class UsersSectionService {
    constructor(
        private readonly repo: UsersSectionRepository
    ) {}

    getUserSecAll() {
        return this.repo.getUserSecAll();
    }

    getUserSecByID(id: number) {
        return this.repo.getUserSecByID(id);
    }

    getSection(searchDto: SearchUsersSectionDto) {
        return this.repo.getSection(searchDto);
    }
}
