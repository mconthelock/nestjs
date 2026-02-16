import { Injectable } from '@nestjs/common';
import { CreateItemMfgDto } from './dto/create-item-mfg.dto';
import { UpdateItemMfgDto } from './dto/update-item-mfg.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMfgRepository } from './item-mfg.repository';

@Injectable()
export class ItemMfgService {
  constructor(private readonly repo: ItemMfgRepository) {}
  async create(dto: CreateItemMfgDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert ITEM_MFG Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert ITEM_MFG Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert ITEM_MFG Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_MFG Failed',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: 'Search ITEM_MFG Failed',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG Error: ' + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_MFG Failed',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateItemMfgDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: 'Update ITEM_MFG Failed',
        };
      }
      return {
        status: true,
        message: 'Update ITEM_MFG Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Update ITEM_MFG Error: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: 'Delete ITEM_MFG Failed',
        };
      }
      return {
        status: true,
        message: 'Delete ITEM_MFG Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Delete ITEM_MFG Error: ' + error.message);
    }
  }
}
