import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { RnlistRepository } from './rnlist.repository';

@Injectable()
export class RnlistService {
  constructor(private readonly repo: RnlistRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNLIST Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNLIST data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNLIST Error: ' + error.message);
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
          message: 'Search RNLIST Failed: No data found',
        };
      }

      return {
        status: true,
        message: 'Search RNLIST data found 1 record(s)',
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNLIST Error: ' + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNLIST Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNLIST data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNLIST Error: ' + error.message);
    }
  }
}