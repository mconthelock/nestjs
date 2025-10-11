import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InquiryGroup } from './entities/inquiry-group.entity';
import { createGroupDto } from './dto/create.dto';
import { searchGroupDto } from './dto/search.dto';
import { updateInqGroupDto } from './dto/update.dto';

@Injectable()
export class InquiryGroupService {
  constructor(
    @InjectRepository(InquiryGroup, 'spsysConnection')
    private readonly group: Repository<InquiryGroup>,
  ) {}

  async search(searchDto: searchGroupDto) {
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

  async create(createDto: createGroupDto) {
    const inquiryGroup = await this.group.create(createDto);
    const res = await this.group.save(inquiryGroup);
    return await this.group.find({ where: { INQ_ID: createDto.INQ_ID } });
  }

  async update({
    data,
    condition,
  }: {
    data: updateInqGroupDto;
    condition?: searchGroupDto;
  }) {
    await this.group.update({ ...condition, INQG_LATEST: 1 }, data);
    return await this.group.find({ where: { ...condition, INQG_LATEST: 1 } });
  }
}
