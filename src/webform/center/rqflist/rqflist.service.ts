import { Injectable } from '@nestjs/common';
import { CreateRqflistDto } from './dto/create-rqflist.dto';
import { UpdateRqflistDto } from './dto/update-rqflist.dto';
import { RqflistRepository } from './rqflist.repository';
import { FormDto } from '../form/dto/form.dto';

@Injectable()
export class RqflistService {
    constructor(private readonly repo: RqflistRepository) {}

    async findOne(form: FormDto){
        try {
            const res = await this.repo.findOne(form);
            if(!res){
                return {
                    status: false,
                    message: 'RQFLIST not found',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error('Error finding RQFLIST: ' + error.message);
        }
    }
}
