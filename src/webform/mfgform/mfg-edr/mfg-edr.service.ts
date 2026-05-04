import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMfgEdrDto } from './dto/create-mfg-edr.dto';
import { SearchCauseDto } from './dto/search-cause.dto';

import { EdrWorktypeMst } from '../../../common/Entities/webform/table/edr_worktype_mst.entity';
import { EdrCauseMst } from '../../../common/Entities/webform/table/edr_cause_mst.entity';
import { EdrLineMst } from '../../../common/Entities/webform/table/edr_line_mst.entity';
import { EdrProcessMst } from '../../../common/Entities/webform/table/edr_process_mst.entity';

@Injectable()
export class MfgEdrService {
  constructor(
    @InjectRepository(EdrWorktypeMst, 'webformConnection')
    private readonly worktypeRepo: Repository<EdrWorktypeMst>,

    @InjectRepository(EdrCauseMst, 'webformConnection')
    private readonly causeRepo: Repository<EdrCauseMst>,

    @InjectRepository(EdrProcessMst, 'webformConnection')
    private readonly processRepo: Repository<EdrProcessMst>,

    @InjectRepository(EdrLineMst, 'webformConnection')
    private readonly lineRepo: Repository<EdrLineMst>,
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

  async getCause(dto: SearchCauseDto) {
    const causeGroup = (dto as any).CAUSE_GROUP;
    if (!causeGroup) {throw new Error('CAUSE_GROUP is required');}
    return this.causeRepo
      .createQueryBuilder('cause')
      .where('cause.FOR_MFG = :forMfg', { forMfg: '1' })
      .andWhere('cause.CAUSE_GROUP = :causeGroup', { causeGroup })
      .orderBy('cause.CID', 'ASC')
      .getMany();
  }

  async getWorktype() {
    return this.worktypeRepo.find({
      where: { FOR_MFG: '1',},
      order: { TID: 'ASC',},
    });
  }

  async getProcess() {
    return this.processRepo.find({
      order: { PID: 'ASC',},
    });
  }

  async getLine() {
    return this.lineRepo.find({
      order: { LID: 'ASC',},
    });
  }

    
}