import { Injectable } from '@nestjs/common';
import { TourRepository } from '../repository/tour.repository';
import { TourUserRepository } from '../repository/tour-user.repository';
import { CreateTourUserDto } from '../dto/tour.dto';

@Injectable()
export class TourService {
    constructor(
        private readonly tourRepo: TourRepository,
        private readonly tourUserRepo: TourUserRepository,
    ) {}

    async findOne(
        type: string,
        data: {
            key: string;
            empno?: string;
        },
    ) {
        try {
            let res: any;
            if (type === 'master') {
                res = await this.tourRepo.findOne(data.key);
            } else if (type === 'user' && data.empno) {
                res = await this.tourUserRepo.findOne(data.key, data.empno);
            } else {
                throw new Error('Invalid type or missing empno for user');
            }
            return !res
                ? {
                      status: false,
                      message: 'Record not found',
                  }
                : {
                      status: true,
                      message: 'Record found',
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }

    async createUser(data: CreateTourUserDto) {
        try {
            const res = await this.tourUserRepo.create({
                EMPNO: data.EMPNO,
                TOUR_KEY: data.KEY,
                TOUR_VERSION: data.VERSION,
            });
            return res
                ? {
                      status: true,
                      message: 'User created successfully',
                      data: res,
                  }
                : {
                      status: false,
                      message: 'Failed to create user',
                  };
        } catch (error) {
            throw error;
        }
    }
}
