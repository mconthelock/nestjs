import { Injectable } from '@nestjs/common';
import { DpmsPlLastRevisionViewRepository } from './dpms_pl_last_revision_view.repository';
import { SearchDpmsPlIssueDto } from '../dpms_pl_issue/dto/search-dpms_pl_issue.dto';

@Injectable()
export class DpmsPlLastRevisionViewService {
    constructor(private readonly repo: DpmsPlLastRevisionViewRepository) {}
    async getLastRevision(dto: SearchDpmsPlIssueDto) {
        try {
            const res = await this.repo.getLastRevision(dto);
            if (res.length === 0) {
                return { status: false, message: 'No data found', data: null };
            }
            return {
                status: true,
                message: `Data retrieved successfully ${res.length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to get last revision: ${error.message}`);
        }
    }
}
