import { Injectable } from '@nestjs/common';
import { CreateDpmsPlIssueDto } from './dto/create-dpms_pl_issue.dto';
import { UpdateDpmsPlIssueDto } from './dto/update-dpms_pl_issue.dto';
import { DpmsPlIssueRepository } from './dpms_pl_issue.repository';

@Injectable()
export class DpmsPlIssueService {
    constructor(
        private readonly repo: DpmsPlIssueRepository,
    ) {}

    async findOne(dto: UpdateDpmsPlIssueDto){
        try {
            const res =  await this.repo.findOne(dto);
            if(!res) {
                return {
                    status: false,
                    message: 'DPMS PL Issue not found',
                }
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to find DPMS PL Issue: ${error.message}`);
        }
    }

    async create(dto: CreateDpmsPlIssueDto) {
        try {
            const res = await this.repo.create(dto);
            if(!res) {
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
}
