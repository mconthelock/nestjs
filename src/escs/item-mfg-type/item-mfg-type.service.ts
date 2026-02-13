import { Injectable } from '@nestjs/common';
import { CreateItemMfgTypeDto } from './dto/create-item-mfg-type.dto';
import { UpdateItemMfgTypeDto } from './dto/update-item-mfg-type.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMfgTypeRepository } from './item-mfg-type.repository';

@Injectable()
export class ItemMfgTypeService {
  constructor(private readonly repo: ItemMfgTypeRepository) {}
  async create(dto: CreateItemMfgTypeDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert ITEM_MFG_TYPE Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert ITEM_MFG_TYPE Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert ITEM_MFG_TYPE Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'ItemMfgType data not found',
          data: [],
        };
      }
      return {
        status: true,
        message: `ItemMfgType data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_TYPE Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: 'ItemMfgType data not found',
          data: [],
        };
      }
      return {
        status: true,
        message: `ItemMfgType data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_TYPE Error: ' + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'ItemMfgType data not found',
          data: [],
        };
      }
      return {
        status: true,
        message: `ItemMfgType data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_TYPE Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateItemMfgTypeDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: 'ItemMfgType data not found',
        };
      }
      return {
        status: true,
        message: 'Update ITEM_MFG_TYPE Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Update ITEM_MFG_TYPE Error: ' + error.message);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: 'ItemMfgType data not found',
        };
      }
      return {
        status: true,
        message: 'Delete ITEM_MFG_TYPE Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Delete ITEM_MFG_TYPE Error: ' + error.message);
    }
  }
}
