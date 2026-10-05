import { Injectable } from '@nestjs/common';
import { CommitteeRepository } from '../repository/committe.repository';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class PurPraService {
    constructor(
        private readonly committeeRepo: CommitteeRepository,
        private readonly groupRepo: GroupRepository,
    ) {}

    async getCommittees() {
        try {
            const res = await this.committeeRepo.findAll();
            return res.length == 0
                ? {
                      status: false,
                      message: 'No committees found',
                  }
                : {
                      status: true,
                      message: `Committees found ${res.length} records`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }

    async getGroups() {
        try {
            const res = await this.groupRepo.findAll();
            return res.length == 0
                ? {
                      status: false,
                      message: 'No groups found',
                  }
                : {
                      status: true,
                      message: `Groups found ${res.length} records`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }
}
