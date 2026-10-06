import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { RnwasteRepository } from './rnwaste.repository';

@Injectable()
export class RnwasteService {
  constructor(private readonly repo: RnwasteRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNWASTE Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNWASTE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNWASTE Error: ' + error.message);
    }
  }

  async findOne(wid: number) {
    try {
      const res = await this.repo.findOne(wid);

      if (!res) {
        return {
          status: false,
          message: `Search RNWASTE by WID ${wid} Failed: No data found`,
        };
      }

      return {
        status: true,
        message: `Search RNWASTE by WID ${wid} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search RNWASTE by WID ${wid} Error: ${error.message}`);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNWASTE Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNWASTE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search RNWASTE Error: ' + error.message);
    }
  }
}