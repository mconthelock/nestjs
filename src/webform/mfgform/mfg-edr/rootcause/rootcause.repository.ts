import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VIEW_MFG_EDR_HEAD_ROOTCAUSE } from 'src/common/Entities/webform/views/VIEW_MFG_EDR_HEAD_ROOTCAUSE.entity';
import { SearchRootcauseDto } from './dto/search-rootcause.dto';
import { AmecOrders } from 'src/common/Entities/workload/table/amecorders.entity';

@Injectable()
export class RootcauseRepository {
  constructor(
    @InjectRepository(VIEW_MFG_EDR_HEAD_ROOTCAUSE, 'webformConnection')
    private readonly repository: Repository<VIEW_MFG_EDR_HEAD_ROOTCAUSE>,

    @InjectRepository(AmecOrders, 'webformConnection')
    private readonly amecOrdersRepository: Repository<AmecOrders>,
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


  async findProductionUnit(fyear: number, months?: string[]) {
    const qb = this.amecOrdersRepository
      .createQueryBuilder('A')
      .select([
        `UPPER(TO_CHAR(A.IDS_DATE, 'MON', 'NLS_DATE_LANGUAGE = AMERICAN')) AS "MONTH"`,
        `
        CASE
          WHEN EXTRACT(MONTH FROM A.IDS_DATE) IN (1, 2, 3)
          THEN EXTRACT(YEAR FROM A.IDS_DATE) - 1
          ELSE EXTRACT(YEAR FROM A.IDS_DATE)
        END AS "FYEAR"
        `,
        `TO_CHAR(A.IDS_DATE, 'DD/MM/YYYY') AS "IDSDATE"`,
        `A.PRJ_NO AS "PRJ_NO"`,
        `A.MFGNO AS "MFGNO"`,
        `A.REVISION AS "REVISION"`,
        `A.PRODTYPE AS "PRODTYPE"`,
        `A.SERIES AS "SERIES"`,
        `A.IDS_DATE AS "IDS_DATE"`,
      ])
      .where('A.IDS_DATE IS NOT NULL')
      .andWhere(
        `
        CASE
          WHEN EXTRACT(MONTH FROM A.IDS_DATE) IN (1, 2, 3)
          THEN EXTRACT(YEAR FROM A.IDS_DATE) - 1
          ELSE EXTRACT(YEAR FROM A.IDS_DATE)
        END = :FYEAR
        `,
        { FYEAR: fyear },
      );

    if (months?.length) {
      qb.andWhere(
        `
        UPPER(
          TO_CHAR(
            A.IDS_DATE,
            'MON',
            'NLS_DATE_LANGUAGE = AMERICAN'
          )
        ) IN (:...MONTHS)
        `,
        {
          MONTHS: months.map(month => month.toUpperCase()),
        },
      );
    }

    return qb
      .orderBy('A.IDS_DATE', 'ASC')
      .getRawMany();
  }

}