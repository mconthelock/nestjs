import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';

import { PilineBendingAttRepository } from './piline_bending_att.repository';

@Injectable()
export class PilineBendingAttService {
  constructor(
    private readonly repo: PilineBendingAttRepository,
  ) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search PILINE_BENDING_ATT Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search PILINE_BENDING_ATT data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search PILINE_BENDING_ATT Error: ' + error.message,
      );
    }
  }

  async findOne(idtag: string) {
    try {
      const res = await this.repo.findOne(idtag);

      if (res.length === 0) {
        return {
          status: false,
          message: `Search PILINE_BENDING_ATT by IDTAG ${idtag} Failed: No data found`,
          data: [],
        };
      }

      return {
        status: true,
        message: `Search PILINE_BENDING_ATT by IDTAG ${idtag} data found ${res.length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search PILINE_BENDING_ATT by IDTAG ${idtag} Error: ${error.message}`,
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
          message: 'Search PILINE_BENDING_ATT Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search PILINE_BENDING_ATT data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search PILINE_BENDING_ATT Error: ' + error.message,
      );
    }
  }
}