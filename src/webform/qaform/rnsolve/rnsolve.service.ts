import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { RnsolveRepository } from './rnsolve.repository';

@Injectable()
export class RnsolveService {
  constructor(private readonly repo: RnsolveRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNSOLVE Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNSOLVE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNSOLVE Error: ' + error.message);
    }
  }

  async findOne(
    nfrmno: number,
    vorgno: string,
    cyear: string,
    cyear2: string,
    nrunno: number,
    id: number,
  ) {
    try {
      const res = await this.repo.findOne(
        nfrmno,
        vorgno,
        cyear,
        cyear2,
        nrunno,
        id,
      );

      if (!res) {
        return {
          status: false,
          message: 'Search RNSOLVE Failed: No data found',
        };
      }

      return {
        status: true,
        message: 'Search RNSOLVE data found 1 record(s)',
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNSOLVE Error: ' + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNSOLVE Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNSOLVE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNSOLVE Error: ' + error.message);
    }
  }
}