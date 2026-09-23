import { Injectable } from '@nestjs/common';
import { PurCpcRepository } from './pur-cpc.repository';
@Injectable()
export class PurCpcService {
    constructor(private readonly repo: PurCpcRepository) {}
    
    async create(data: any) {
        return await this.repo.create(data);
    }
}
