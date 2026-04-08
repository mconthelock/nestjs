import { Injectable } from '@nestjs/common';
import { CreateUsersFileDto } from './dto/create-user-file.dto';
import { UpdateUsersFileDto } from './dto/update-user-file.dto';
import { UsersFileRepository } from './user-file.repository';

@Injectable()
export class UsersFileService {
    constructor(private readonly repo: UsersFileRepository) {}

    async addUserFile(dto: CreateUsersFileDto) {
        try {
            dto.UF_ID = await this.repo.newId(dto);

            const res = await this.repo.insert(dto);
            if (res.identifiers.length === 0) {
                throw new Error('Insert user file failed');
            }
            return {
                status: true,
                message: 'Insert user file Successfully',
            };
        } catch (error) {
            throw new Error('Insert user file ' + error.message);
        }
    }

    async newId(dto: UpdateUsersFileDto) {
        return this.repo.newId(dto);
    }
}
