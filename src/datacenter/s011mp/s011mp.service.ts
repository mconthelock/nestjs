import { Injectable } from '@nestjs/common';
import { S011mpRepository } from './s011mp.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class S011mpService {
  constructor(private readonly repo: S011mpRepository) {}
  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search S011MP Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search S011MP data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search S011MP Error: ' + error.message);
    }
  }

  async findOne(S11M01: string, S11M02: string) {
    try {
      const res = await this.repo.findOne(S11M01, S11M02);
      if (res == null) {
        return {
          status: false,
          message: `Search S011MP by id ${S11M01}, ${S11M02} Failed: No data found`,
        };
      }
      return {
        status: true,
        message: `Search S011MP by id ${S11M01}, ${S11M02} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search S011MP by id ${S11M01}, ${S11M02} Error: ` + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search S011MP Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search S011MP data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search S011MP Error: ' + error.message);
    }
  }
}
