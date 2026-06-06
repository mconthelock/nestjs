import { Injectable } from '@nestjs/common';
import { CreateDpmsPlIssueRevDto } from './dto/create-dpms_pl_issue_rev.dto';
import { UpdateDpmsPlIssueRevDto } from './dto/update-dpms_pl_issue_rev.dto';
import { DpmsPlIssueRevRepository } from './dpms_pl_issue_rev.repository';
import type { dpmsPlIssueRevFindLatestRevision } from './dpms_pl_issue_rev.interface';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';

@Injectable()
export class DpmsPlIssueRevService {
    constructor(private readonly repo: DpmsPlIssueRevRepository) {}
    async create(dto: CreateDpmsPlIssueRevDto) {
        try {
            let revision = dto.NREV;
            if(!revision){
                revision = await this.getNextRevision({
                    VPROD: dto.VPROD,
                    VP: dto.VP,
                    VTYPE: dto.VTYPE,
                    VORDERS: dto.VORDERS,
                    NISSUE_TYPE: dto.NISSUE_TYPE,
                });
            }
            const res = await this.repo.create({
                ...dto,
                NREV: revision,
                VREVTEXT: numberToAlphabetRevision(revision),
            });
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create DPMS PL Issue',
                };
            }
            return {
                status: true,
                message: 'DPMS PL Issue created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to create DPMS PL Issue: ${error.message}`);
        }
    }

    async getNextRevision(
        condition: dpmsPlIssueRevFindLatestRevision,
    ): Promise<number> {
        const lastRevision = await this.repo.findLatestRevision(condition);
        return lastRevision ? lastRevision.NREV + 1 : 0;
    }
}
