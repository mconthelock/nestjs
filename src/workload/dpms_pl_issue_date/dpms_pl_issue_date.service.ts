import { Injectable } from '@nestjs/common';
import { CreateDpmsPlIssueDateDto } from './dto/create-dpms_pl_issue_date.dto';
import { UpdateDpmsPlIssueDateDto } from './dto/update-dpms_pl_issue_date.dto';
import { DpmsPlIssueDateRepository } from './dpms_pl_issue_date.repository';
import { DPMS_PL_ISSUE_PK } from 'src/mfgreport/dpms/packing-list-issue/packing-list-issue.interface';

@Injectable()
export class DpmsPlIssueDateService {
    constructor(private readonly repo: DpmsPlIssueDateRepository) {}

    async findOne(dto: DPMS_PL_ISSUE_PK) {
        try {
            const res = await this.repo.findOne(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'DPMS PL Issue Date not found',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to find DPMS PL Issue Date: ${error.message}`,
            );
        }
    }
}
