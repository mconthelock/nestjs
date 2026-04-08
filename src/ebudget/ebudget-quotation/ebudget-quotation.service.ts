import { Injectable } from '@nestjs/common';
import { CreateEbudgetQuotationDto } from './dto/create-ebudget-quotation.dto';
import { UpdateEbudgetQuotationDto } from './dto/update-ebudget-quotation.dto';
import { EBUDGET_QUOTATION } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { now } from 'src/common/utils/dayjs.utils';
import { EbudgetQuotationRepository } from './ebudget-quotation.repository';

@Injectable()
export class EbudgetQuotationService {
    constructor(private readonly repo: EbudgetQuotationRepository) {}

    async getData(dto: UpdateEbudgetQuotationDto) {
        return this.repo.getData(dto);
    }

    async insert(dto: CreateEbudgetQuotationDto) {
        try {
            const res = await this.repo.insert(dto);
            if (!res) {
                throw new Error('Insert EBUDGET_QUOTATION Failed');
            }
            return {
                status: true,
                message: 'Insert EBUDGET_QUOTATION Successfully',
                data: res,
            };
        } catch (error) {
            throw new Error('Insert EBUDGET_QUOTATION Error: ' + error.message);
        }
    }

    async update(dto: UpdateEbudgetQuotationDto) {
        try {
            const res = await this.repo.update(dto);
            if (res.affected === 0) {
                throw new Error(
                    'Update EBUDGET_QUOTATION Failed: No rows affected',
                );
            }
            return {
                status: true,
                data: res,
                message: 'Update EBUDGET_QUOTATION Successfully',
            };
        } catch (error) {
            throw new Error('Update EBUDGET_QUOTATION Error: ' + error.message);
        }
    }
}
