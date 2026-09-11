import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreatePilineBendingMainDto } from './dto/create_piline_bending_main.dto';
import { PilineBendingMainRepository } from './piline_bending_main.repository';

@Injectable()
export class PilineBendingMainService {
  constructor(
    private readonly repo: PilineBendingMainRepository,
  ) {}

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;

      if (length === 0) {
        return {
          status: false,
          message:
            'Search PILINE_BENDING_MAIN Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message:
          `Search PILINE_BENDING_MAIN data found ` +
          `${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search PILINE_BENDING_MAIN Error: ' +
          error.message,
      );
    }
  }

  async findOne(IDTAG: string) {
    try {
      const res = await this.repo.findOne(IDTAG);

      if (!res) {
        return {
          status: false,
          message:
            `Search PILINE_BENDING_MAIN by IDTAG ` +
            `${IDTAG} Failed: No data found`,
        };
      }

      return {
        status: true,
        message:
          `Search PILINE_BENDING_MAIN by IDTAG ` +
          `${IDTAG} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search PILINE_BENDING_MAIN by IDTAG ` +
          `${IDTAG} Error: ${error.message}`,
      );
    }
  }

  async create(dto: CreatePilineBendingMainDto) {
    try {
      const IDTAG = dto.IDTAG;

      if (!IDTAG) {
        return {
          status: false,
          message: 'IDTAG is required',
        };
      }

      const existing = await this.repo.findOne(IDTAG);

      if (existing) {
        return {
          status: false,
          message:
            `Create PILINE_BENDING_MAIN Failed: ` +
            `IDTAG ${IDTAG} already exists`,
        };
      }

      const res = await this.repo.create({
        ...dto,
        IDTAG: IDTAG,
      });

      return {
        status: true,
        message:
          'Create PILINE_BENDING_MAIN successfully',
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Create PILINE_BENDING_MAIN Error: ' +
          error.message,
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
          message:
            'Search PILINE_BENDING_MAIN Failed: No data found',
          data: [],
        };
      }

      return {
        status: true,
        message:
          `Search PILINE_BENDING_MAIN data found ` +
          `${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        'Search PILINE_BENDING_MAIN Error: ' +
          error.message,
      );
    }
  }
}