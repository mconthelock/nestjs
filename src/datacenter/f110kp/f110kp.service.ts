import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { F110kpRepository } from './f110kp.repository';

@Injectable()
export class F110kpService {
  constructor(private readonly repo: F110kpRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search F110KP Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search F110KP data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search F110KP Error: ' + error.message);
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: `Search F110KP by id ${id} Failed: No data found`,
        };
      }
      return {
        status: true,
        message: `Search F110KP by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search F110KP by id ${id} Error: ` + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search F110KP Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search F110KP data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search F110KP Error: ' + error.message);
    }
  }
}
