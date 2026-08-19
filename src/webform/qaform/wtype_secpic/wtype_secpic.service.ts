import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { WtypeSecpicRepository } from './wtype_secpic.repository';

@Injectable()
export class WtypeSecpicService {
  constructor(
    private readonly repo: WtypeSecpicRepository,
  ) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search WTYPE_SECPIC Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search WTYPE_SECPIC data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search WTYPE_SECPIC Error: ' + error.message,
      );
    }
  }

  async findOne(tid: number, secid: number) {
    try {
      const res = await this.repo.findOne(tid, secid);

      if (!res) {
        return {
          status: false,
          message:
            `Search WTYPE_SECPIC by TID ${tid} ` +
            `and SECID ${secid} Failed: No data found`,
        };
      }

      return {
        status: true,
        message:
          `Search WTYPE_SECPIC by TID ${tid} ` +
          `and SECID ${secid} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search WTYPE_SECPIC by TID ${tid} ` +
          `and SECID ${secid} Error: ${error.message}`,
      );
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search WTYPE_SECPIC Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search WTYPE_SECPIC data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search WTYPE_SECPIC Error: ' + error.message,
      );
    }
  }

  async findSectionsByWtype(tid: number) {
    try {
      const res = await this.repo.findSectionsByWtype(tid);
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: `Search sections by WTYPE ${tid} Failed: No data found`,
          data: [],
        };
      }

      return {
        status: true,
        message: `Search sections by WTYPE ${tid} data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search sections by WTYPE ${tid} Error: ${error.message}`,
      );
    }
  }
}