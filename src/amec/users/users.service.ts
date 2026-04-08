import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly repo: UsersRepository,
    ) {}

    findEmp(empno: string) {
        return this.repo.findOne(empno);
    }

    findEmpEncode(empno: string) {
        return this.repo.findEmpEncode(empno);
    }

    search() {
        return this.repo.findAll();
    }

    findBirthday(month: string) {
        return this.repo.findBirthday(month);
    }

    async findOne(empno: string) {
        try {
            const res = await this.repo.findOne(empno);
            if (!res) {
                return {
                    status: false,
                    message: `Employee with empno ${empno} not found`,
                };
            }
            return {
                status: true,
                message: `Employee with empno ${empno} found`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Error finding employee with empno ${empno}: ` + error.message,
            );
        }
    }
}
