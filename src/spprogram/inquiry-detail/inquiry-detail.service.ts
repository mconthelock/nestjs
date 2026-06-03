import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InquiryDetail } from './entities/inquiry-detail.entity';
import { createDetailDto } from './dto/create.dto';
import { updateDetailDto } from './dto/update.dto';

@Injectable()
export class InquiryDetailService {
    constructor(
        @InjectRepository(InquiryDetail, 'spsysConnection')
        private readonly detail: Repository<InquiryDetail>,
    ) {}

    async create(createDto: createDetailDto) {
        const inquiryDetail = await this.detail.create(createDto);
        return await this.detail.save(inquiryDetail);
    }

    async update(updateDto: updateDetailDto) {
        const { INQD_ID, ...updateData } = updateDto;
        if (!INQD_ID || Object.keys(updateData).length === 0) {
            throw new Error(
                'Empty criteria(s) are not allowed for the update method',
            );
        }
        await this.detail.update(INQD_ID, updateData);
        return await this.detail.findOneBy({ INQD_ID });
    }
}
