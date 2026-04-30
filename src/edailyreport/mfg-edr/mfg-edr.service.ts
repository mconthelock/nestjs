import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMfgEdrDto } from './dto/create-mfg-edr.dto';
import { SearchCauseDto } from './dto/search-cause.dto';

import { EdrWorktypeMst } from '../../common/Entities/edailyreport/table/edr_worktype_mst.entity';
import { EdrCauseMst } from '../../common/Entities/edailyreport/table/edr_cause_mst.entity';

@Injectable()
export class MfgEdrService {
  constructor(
    @InjectRepository(EdrWorktypeMst, 'webformConnection')
    private readonly worktypeRepo: Repository<EdrWorktypeMst>,

    @InjectRepository(EdrCauseMst, 'webformConnection')
    private readonly causeRepo: Repository<EdrCauseMst>,
  ) {}

  create(createMfgEdrDto: CreateMfgEdrDto) {
    return 'This action adds a new mfgEdr';
  }

  findAll() {
    return `This action returns all mfgEdr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mfgEdr`;
  }

  remove(id: number) {
    return `This action removes a #${id} mfgEdr`;
  }

  async getWorktype() {
    return this.worktypeRepo.find({
      where: {
        FOR_MFG: '1',
      },
      order: {
        TID: 'ASC',
      },
    });
  }

  async getCause(dto: SearchCauseDto) {
    return this.causeRepo.find({
      where: {
        FOR_MFG: '1',
        CAUSE_GROUP: dto.CAUSE_GROUP,
      },
      order: {
        CID: 'ASC',
      },
    });
  }
}