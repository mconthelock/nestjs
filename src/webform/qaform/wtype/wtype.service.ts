import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { WtypeRepository } from './wtype.repository';

@Injectable()
export class WtypeService {
  constructor(private readonly repo: WtypeRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search WTYPE Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search WTYPE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search WTYPE Error: ' + error.message);
    }
  }

  async findOne(tid: number) {
    try {
      const res = await this.repo.findOne(tid);

      if (!res) {
        return {
          status: false,
          message: `Search WTYPE by TID ${tid} Failed: No data found`,
        };
      }

      return {
        status: true,
        message: `Search WTYPE by TID ${tid} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search WTYPE by TID ${tid} Error: ${error.message}`);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search WTYPE Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search WTYPE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search WTYPE Error: ' + error.message);
    }
  }
}