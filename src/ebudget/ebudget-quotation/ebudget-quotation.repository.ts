import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { UpdateEbudgetQuotationDto } from './dto/update-ebudget-quotation.dto';
import { EBUDGET_QUOTATION } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION.entity';
import { CreateEbudgetQuotationDto } from './dto/create-ebudget-quotation.dto';

@Injectable()
export class EbudgetQuotationRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getData(dto: UpdateEbudgetQuotationDto) {
        return this.getRepository(EBUDGET_QUOTATION).find({
            where: dto,
        });
    }

    async insert(dto: CreateEbudgetQuotationDto) {
        return this.manager.save(EBUDGET_QUOTATION, dto);
    }

    async update(dto: UpdateEbudgetQuotationDto) {
        const { ID, ...updateData } = dto;

        return this.manager.update(EBUDGET_QUOTATION, ID, updateData);
    }
}
