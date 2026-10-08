import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { SecpicRepository } from './secpic.repository';

@Injectable()
export class SecpicService {
  constructor(private readonly repo: SecpicRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search SECPIC Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search SECPIC data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search SECPIC Error: ' + error.message);
    }
  }

  async findOne(secid: number) {
    try {
      const res = await this.repo.findOne(secid);

      if (!res) {
        return {
          status: false,
          message: `Search SECPIC by SECID ${secid} Failed: No data found`,
        };
      }

      return {
        status: true,
        message: `Search SECPIC by SECID ${secid} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search SECPIC by SECID ${secid} Error: ${error.message}`);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search SECPIC Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search SECPIC data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search SECPIC Error: ' + error.message);
    }
  }
}