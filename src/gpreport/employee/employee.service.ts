import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
    constructor(private readonly repo: EmployeeRepository) {}

    async findOne(id: string) {
        return this.repo.findOne(id);
    }
}
