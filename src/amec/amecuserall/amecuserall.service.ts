import { Injectable } from '@nestjs/common';
import { AmecUserAllRepository } from './amecuserall.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class AmecUserAllService {
    constructor(private readonly repo: AmecUserAllRepository) {}

    async findEmp(empno: string) {
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

    async findEmpEncode(empno: string) {
        try {
            const res = await this.repo.findEmpEncode(empno);
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

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const count = res.length;
            if (count === 0) {
                return {
                    status: false,
                    message: `No employees found`,
                };
            }
            return {
                status: true,
                message: `Employee found ${count} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Error finding employee Error: ` + error.message,
            );
        }
        
    }

    findEmpBirth(month: string) {
        return this.repo.findEmpBirth(month);
    }
}
