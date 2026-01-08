import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EBUDGET_DATA_SN } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_SN.entity';
import { Repository } from 'typeorm';
import { SearchEbudgetSnDto } from './dto/search.dto';

@Injectable()
export class SnService {
  constructor(
    @InjectRepository(EBUDGET_DATA_SN, 'ebudgetConnection')
    private readonly repo: Repository<EBUDGET_DATA_SN>,
  ) {}

  findAll() {
    return this.repo.find({ order: { FYEAR: 'ASC', SN: 'ASC' } });
  }

  async getDataSn(dto: SearchEbudgetSnDto) {
    return await this.repo.find({
      where: {
        VORGCODE: dto.VORGCODE,
        FYEAR: dto.FYEAR,
        CSTATUS: '1',
      },
      order: { SN: 'ASC' },
    });
  }
}
