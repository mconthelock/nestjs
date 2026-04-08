import { Injectable } from '@nestjs/common';
import { CreateUsersItemStationDto } from './dto/create-user-item-station.dto';
import { UsersItemStationRepository } from './user-item-station.repository';

@Injectable()
export class UsersItemStationService {
    constructor(private readonly repo: UsersItemStationRepository) {}
    async addUserItemStation(dto: CreateUsersItemStationDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                throw new Error('Insert user item station Failed');
            }
            return {
                status: true,
                message: 'Insert user item station Successfully',
            };
        } catch (error) {
            throw new Error('Insert user item station ' + error.message);
        }
    }
}
