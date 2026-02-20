import { Injectable } from '@nestjs/common';
import { CreateItemMasterAuthorizeDto } from './dto/create-item-master-authorize.dto';
import { UpdateItemMasterAuthorizeDto } from './dto/update-item-master-authorize.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMasterAuthorizeRepository } from './item-master-authorize.repository';

@Injectable()
export class ItemMasterAuthorizeService {
  constructor(private readonly repo: ItemMasterAuthorizeRepository) {}
  async create(dto: CreateItemMasterAuthorizeDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert ITEM_MASTER_AUTHORIZE Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert ITEM_MASTER_AUTHORIZE Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert ITEM_MASTER_AUTHORIZE Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_MASTER_AUTHORIZE Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MASTER_AUTHORIZE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MASTER_AUTHORIZE Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: `Search ITEM_MASTER_AUTHORIZE by id ${id} Failed: No data found`,
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MASTER_AUTHORIZE by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search ITEM_MASTER_AUTHORIZE by id ${id} Error: ` + error.message,
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
          message: 'Search ITEM_MASTER_AUTHORIZE Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MASTER_AUTHORIZE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MASTER_AUTHORIZE Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateItemMasterAuthorizeDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_MASTER_AUTHORIZE by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Update ITEM_MASTER_AUTHORIZE by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Update ITEM_MASTER_AUTHORIZE by id ${id} Error: ` + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Delete ITEM_MASTER_AUTHORIZE by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Delete ITEM_MASTER_AUTHORIZE by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Delete ITEM_MASTER_AUTHORIZE by id ${id} Error: ` + error.message,
      );
    }
  }
}
