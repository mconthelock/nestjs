import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AEmployee } from '../../common/Entities/amec/table/AEMPLOYEE.entity';
import { CreateAemployeeDto } from './dto/create-aemployee.dto';
import { UpdateAemployeeDto } from './dto/update-aemployee.dto';

@Injectable()
export class AemployeeService {
    constructor(
        @InjectRepository(AEmployee, 'mitsuConnection')
        private readonly emp: Repository<AEmployee>,
    ) {}

    async create(createAemployeeDto: CreateAemployeeDto) {
        const aemployee = this.emp.create(createAemployeeDto);
        const result = await this.emp.save(aemployee);
        return result;
    }

    findAll() {
        return this.emp.find();
    }

    async findOne(id: string) {
        const user = await this.emp.findOne({
            where: { SEMPNO: id },
        });
        return user;
    }

    async findOneBySLogin(id: string) {
        const user = await this.emp.findOne({
            where: { SLOGIN: id },
            select: [
                'SEMPNO',
                'SNAME',
                'SDIVCODE',
                'SDEPCODE',
                'SSECCODE',
                'SPOSCODE',
                'SPASSWORD1',
            ],
        });
        return user;
    }

    async updatePassword(id: string, updateAemployeeDto: UpdateAemployeeDto) {
        return;
    }
}
