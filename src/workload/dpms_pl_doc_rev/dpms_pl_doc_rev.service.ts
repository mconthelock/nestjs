import { Injectable } from '@nestjs/common';
import {
    CreateDpmsPlDocRevDto,
    SearchDpmsPlDocRevDto,
} from './dto/create-dpms_pl_doc_rev.dto';
import { DpmsPlDocRevRepository } from './dpms_pl_doc_rev.repository';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';
import {
    getPendingRecordParams,
    findPreviousRevisionExcludingIssueRevParams,
} from 'src/mfgreport/dpms/packing-list-issue/packing-list-issue.interface';

@Injectable()
export class DpmsPlDocRevService {
    constructor(private readonly repo: DpmsPlDocRevRepository) {}

    async create(dto: CreateDpmsPlDocRevDto) {
        try {
            const res = await this.repo.create({
                ...dto,
                VREVTEXT: numberToAlphabetRevision(dto.NREV),
            });
            if (!res) {
                return {
                    status: false,
                    message: 'Insert document revision failed',
                };
            }
            return {
                status: true,
                message: 'Insert document revision successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert document revision Error: ' + error.message);
        }
    }

    async getList(dto: SearchDpmsPlDocRevDto) {
        try {
            const res = await this.repo.getList(dto);
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'Get document revision list failed',
                };
            }
            return {
                status: true,
                message: `Get document revision list ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Get document revision list Error: ' + error.message,
            );
        }
    }

    async getPendingRecord(condition: getPendingRecordParams) {
        try {
            const res = await this.repo.getPendingRecord(condition);
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'No pending document revision record found',
                };
            }
            return {
                status: true,
                message: `Get pending document revision record ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Get pending document revision record Error: ' + error.message,
            );
        }
    }

    async findPreviousRevisionExcludingIssueRev(condition: findPreviousRevisionExcludingIssueRevParams) {
        try {
            const res = await this.repo.findPreviousRevisionExcludingIssueRev(condition);
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'No previous document revision record found',
                };
            }
            return {
                status: true,
                message: `Get previous document revision record ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Get previous document revision record Error: ' + error.message,
            );
        }
    }
}
