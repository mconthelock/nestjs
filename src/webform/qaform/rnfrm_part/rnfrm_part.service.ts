import { Injectable } from '@nestjs/common';

import { FiltersDto } from 'src/common/dto/filter.dto';
import { RnfrmPartRepository } from './rnfrm_part.repository';

@Injectable()
export class RnfrmPartService {
  constructor(private readonly repo: RnfrmPartRepository) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message: 'Search RNFRM_PART Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNFRM_PART data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search RNFRM_PART Error: ' + error.message,
      );
    }
  }

  async findOne(cyear2: string, nrunno: number) {
    try {
      const res = await this.repo.findOne(cyear2, nrunno);

      if (!res) {
        return {
          status: false,
          message:
            `Search RNFRM_PART by CYEAR2 ${cyear2} ` +
            `and NRUNNO ${nrunno} Failed: No data found`,
        };
      }

      return {
        status: true,
        message:
          `Search RNFRM_PART by CYEAR2 ${cyear2} ` +
          `and NRUNNO ${nrunno} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search RNFRM_PART by CYEAR2 ${cyear2} ` +
        `and NRUNNO ${nrunno} Error: ${error.message}`,
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
          message: 'Search RNFRM_PART Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message: `Search RNFRM_PART data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search RNFRM_PART Error: ' + error.message,
      );
    }
  }
}