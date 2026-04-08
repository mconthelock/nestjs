import { Injectable } from '@nestjs/common';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { USERS_ITEM } from 'src/common/Entities/escs/table/USERS_ITEM.entity';
import { UserItemRepository } from './user-item.repository';

@Injectable()
export class UserItemService {
    constructor(private readonly repo: UserItemRepository) {}

    async addUserItem(dto: CreateUserItemDto) {
        try {
            await this.repo.create(dto);
            return {
                status: true,
                message: 'Insert user item Successfully',
            };
        } catch (error) {
            throw new Error('Insert user item ' + error.message);
        }
    }
}
