import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlockMasterDto } from './dto/create-block-master.dto';
import { UpdateBlockMasterDto } from './dto/update-block-master.dto';
import { BlockMasterRepository } from './block-master.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class BlockMasterService {
  constructor(private readonly repo: BlockMasterRepository) {}
  async create(dto: CreateBlockMasterDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert BLOCK_MASTER Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert BLOCK_MASTER Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert BLOCK_MASTER Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Block data not found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Block data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search BLOCK_MASTER Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: 'Block data not found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Block data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search BLOCK_MASTER Error: ' + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Block data not found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Block data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search BLOCK_MASTER Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateBlockMasterDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: 'Block data not found',
        };
      }
      return {
        status: true,
        message: 'Update BLOCK_MASTER Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Update BLOCK_MASTER Error: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: 'Block data not found',
        };
      }
      return {
        status: true,
        message: 'Delete BLOCK_MASTER Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Delete BLOCK_MASTER Error: ' + error.message);
    }
  }
}
