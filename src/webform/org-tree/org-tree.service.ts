import { Injectable } from '@nestjs/common';
import { OrgTreeRepository } from './org-tree.repository';

@Injectable()
export class OrgTreeService {
    constructor(private readonly repo: OrgTreeRepository) {}

    async getOrgTree(
        orgno: string,
        vposno: string,
        empno: string,
        emppos: string,
    ) {
        return await this.repo.getOrgTree(orgno, vposno, empno, emppos);
    }
}
