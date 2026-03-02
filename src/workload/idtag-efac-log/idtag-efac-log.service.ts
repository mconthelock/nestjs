import { Injectable } from '@nestjs/common';
import { CreateIdtagEfacLogDto } from './dto/create-idtag-efac-log.dto';
import { UpdateIdtagEfacLogDto } from './dto/update-idtag-efac-log.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { IdtagEfacLogRepository } from './idtag-efac-log.repository';

@Injectable()
export class IdtagEfacLogService {
constructor(private readonly repo: IdtagEfacLogRepository) {}
  async create(dto: CreateIdtagEfacLogDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert IDTAG_EFAC_LOG Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert IDTAG_EFAC_LOG Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert IDTAG_EFAC_LOG Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search IDTAG_EFAC_LOG Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search IDTAG_EFAC_LOG data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search IDTAG_EFAC_LOG Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: `Search IDTAG_EFAC_LOG by id ${id} Failed: No data found`,
        };
      }
      return {
        status: true,
        message: `Search IDTAG_EFAC_LOG by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search IDTAG_EFAC_LOG by id ${id} Error: ` + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search IDTAG_EFAC_LOG Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search IDTAG_EFAC_LOG data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search IDTAG_EFAC_LOG Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateIdtagEfacLogDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update IDTAG_EFAC_LOG by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Update IDTAG_EFAC_LOG by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Update IDTAG_EFAC_LOG by id ${id} Error: ` + error.message);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Delete IDTAG_EFAC_LOG by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Delete IDTAG_EFAC_LOG by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Delete IDTAG_EFAC_LOG by id ${id} Error: ` + error.message);
    }
  }
}
