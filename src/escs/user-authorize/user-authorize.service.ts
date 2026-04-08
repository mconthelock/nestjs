import { Injectable } from '@nestjs/common';
import { CreateUsersAuthorizeDto } from './dto/create-user-authorize.dto';
import { UsersAuthorizeRepository } from './user-authorize.repository';

@Injectable()
export class UsersAuthorizeService {
    constructor(private readonly repo: UsersAuthorizeRepository) {}

    async addUserAuth(dto: CreateUsersAuthorizeDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Insert user Auth Failed');
            }
            return {
                status: true,
                message: 'Insert user Auth Successfully',
            };
        } catch (error) {
            throw new Error('Insert user Auth ' + error.message);
        }
    }
}
