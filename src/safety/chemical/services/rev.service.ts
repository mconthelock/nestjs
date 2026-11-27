import { Injectable, NotFoundException } from '@nestjs/common';

import { RevRepository } from '../repository/rev.repository';
import { alphabetToNumberRevision, numberToAlphabetRevision } from 'src/common/utils/format.utils';

@Injectable()
export class RevService {
    constructor(private readonly revRepo: RevRepository) {}

    async find(type: 'all' | 'active' | 'inactive' | 'sec-active') {
        try {
            const res = await this.revRepo.find(type);
            return res.length > 0
                ? {
                      status: true,
                      message: `Data found ${res.length} records`,
                      data: res,
                  }
                : {
                      status: false,
                      message: `No data found`,
                      data: [],
                  };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-13
     * @description อัปเดต revision ของ master
     * @returns ผลลัพธ์การอัปเดต revision
     */
    async updateRevisionMaster(revision: string) {
        try {
            const res = await this.revRepo.updateRevisionMaster(revision);
            return res
                ? {
                      status: true,
                      message: `Revision ${revision} updated successfully`,
                      data: res,
                  }
                : {
                      status: false,
                      message: `Revision ${revision} not found`,
                      data: null,
                  };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-27
     * @description อัปเดต revision ของ owner
     * @param ownerCode 
     * @returns 
     */
    async updateRevision(ownerCode: string){
        try {
            const data = await this.revRepo.findOneByCode(ownerCode);
            if(!data){
                throw new NotFoundException(`Owner code ${ownerCode} not found`);
            }
            const revision = numberToAlphabetRevision(alphabetToNumberRevision(data.REV) + 1)
            const res = await this.revRepo.updateRevision(ownerCode, revision);
            return {
                status: true,
                message: `Revision ${revision} updated successfully`,
                data: revision,
            }
        } catch (error) {
            throw error;
        }
    }
}
