import { Injectable } from '@nestjs/common';
import { SearchUsersDto } from './dto/search-escs-user.dto';
import {
    getSelectNestedFields,
    getSafeFields,
} from '../../common/utils/Fields.utils';
import { CreateUsersDto } from './dto/create-escs-user.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly repo: UsersRepository) {}

    getUserAll() {
        return this.repo.getUserAll();
    }

    getUserByID(id: number) {
        return this.repo.getUserByID(id);
    }

    getUser(searchDto: SearchUsersDto) {
        return this.repo.getUser(searchDto);
    }

    async addUser(dto: CreateUsersDto) {
        try {
            const res = await this.repo.insertUser(dto);
            if (res.identifiers.length === 0) {
                throw new Error('Insert user failed');
            }
            return {
                status: true,
                message: 'Insert user Successfully',
            };
        } catch (error) {
            throw new Error('Insert user ' + error.message);
        }
    }
}
