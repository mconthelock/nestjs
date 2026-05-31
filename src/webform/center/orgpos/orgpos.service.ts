import { Injectable } from '@nestjs/common';
import { SearchOrgpoDto } from './dto/search-orgpo.dto';
import { OrgposRepository } from './orgpos.repository';

@Injectable()
export class OrgposService {
    constructor(private readonly repo: OrgposRepository) {}

    async getOrgPos(dto: SearchOrgpoDto) {
        return this.repo.getOrgPos(dto);
    }
}
