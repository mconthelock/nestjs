import { Injectable } from '@nestjs/common';
import { CreateItemMfgDeleteDto } from './dto/create-item-mfg-delete.dto';
import { UpdateItemMfgDeleteDto } from './dto/update-item-mfg-delete.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMfgDeleteRepository } from './item-mfg-delete.repository';

@Injectable()
export class ItemMfgDeleteService {
 constructor(private readonly repo: ItemMfgDeleteRepository) {}
  async create(dto: CreateItemMfgDeleteDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert ITEM_MFG_DELETE Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert ITEM_MFG_DELETE Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert ITEM_MFG_DELETE Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_MFG_DELETE Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG_DELETE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_DELETE Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: `Search ITEM_MFG_DELETE by id ${id} Failed: No data found`,
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG_DELETE by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search ITEM_MFG_DELETE by id ${id} Error: ` + error.message,
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
          message: 'Search ITEM_MFG_DELETE Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG_DELETE data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_DELETE Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateItemMfgDeleteDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_MFG_DELETE by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Update ITEM_MFG_DELETE by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Update ITEM_MFG_DELETE by id ${id} Error: ` + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Delete ITEM_MFG_DELETE by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Delete ITEM_MFG_DELETE by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Delete ITEM_MFG_DELETE by id ${id} Error: ` + error.message,
      );
    }
  }
}
