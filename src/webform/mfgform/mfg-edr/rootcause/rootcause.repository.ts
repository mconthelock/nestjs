import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VIEW_MFG_EDR_HEAD_ROOTCAUSE } from 'src/common/Entities/webform/views/VIEW_MFG_EDR_HEAD_ROOTCAUSE.entity';
import { SearchRootcauseDto } from './dto/search-rootcause.dto';

@Injectable()
export class RootcauseRepository {
  constructor(
    @InjectRepository(VIEW_MFG_EDR_HEAD_ROOTCAUSE, 'webformConnection')
    private readonly repository: Repository<VIEW_MFG_EDR_HEAD_ROOTCAUSE>,
  ) {}

  findAll() {
    return this.repository.find({
      order: {
        FYEAR: 'DESC',
        CYEAR2: 'DESC',
        DAILY_RUNNO: 'DESC',
      },
    });
  }

  findByFiscalYear(fyear: number) {
    return this.repository.find({
      where: {
        FYEAR: fyear,
      },
      order: {
        SSECCODE: 'ASC',
        DAILY_MONTH: 'ASC',
        DAILY_RUNNO: 'ASC',
      },
    });
  }

  async search(dto: SearchRootcauseDto) {
    const qb = this.repository.createQueryBuilder('A');

    qb.where('A.FYEAR = :FYEAR', {
        FYEAR: dto.FYEAR,
    });

    if (dto.CID?.length) {
        qb.andWhere('A.CID IN (:...CID)', {
        CID: dto.CID,
        });
    }

    if (dto.SSECCODE?.length) {
        qb.andWhere('A.SSECCODE IN (:...SSECCODE)', {
        SSECCODE: dto.SSECCODE,
        });
    }


    return qb
        .orderBy('A.CYEAR2', 'ASC')
        .addOrderBy('A.DAILY_MONTH', 'ASC')
        .addOrderBy('A.DAILY_RUNNO', 'ASC')
        .getMany();
    }
}