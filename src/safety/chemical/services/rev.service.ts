import { Injectable } from '@nestjs/common';

import { RevRepository } from '../repository/rev.repository';

@Injectable()
export class RevService {
    constructor(private readonly revRepo: RevRepository) {}

    async find(type: 'all' | 'active' | 'inactive') {
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
}
