import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InquiryGroup } from './entities/inquiry-group.entity';
import { createDto } from './dto/create.dto';
import { searchDto } from './dto/search.dto';

@Injectable()
export class InquiryGroupService {
  constructor(
    @InjectRepository(InquiryGroup, 'amecConnection')
    private readonly group: Repository<InquiryGroup>,
  ) {}

  async search(searchDto: searchDto) {
    const q = { INQG_LATEST: 1 };
    return this.group.find({
      where: {
        ...searchDto,
        ...q,
      },
    });
  }

  async find(id: number) {
    return await this.group.find({ where: { INQ_ID: id, INQG_LATEST: 1 } });
  }

  async create(createDto: createDto) {
    const inquiryGroup = await this.group.create(createDto);
    const res = await this.group.save(inquiryGroup);
    return await this.group.find({ where: { INQ_ID: createDto.INQ_ID } });
  }
}
