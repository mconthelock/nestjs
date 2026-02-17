import { Injectable } from '@nestjs/common';
import { CreateItemSheetMfgDto } from './dto/create-item-sheet-mfg.dto';
import { UpdateItemSheetMfgDto } from './dto/update-item-sheet-mfg.dto';
import { ItemSheetMfgRepository } from './item-sheet-mfg.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class ItemSheetMfgService {
  constructor(private readonly repo: ItemSheetMfgRepository) {}
  async create(dto: CreateItemSheetMfgDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert ITEM_SHEET_MFG Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert ITEM_SHEET_MFG Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert ITEM_SHEET_MFG Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_SHEET_MFG Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_SHEET_MFG data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_SHEET_MFG Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: `Search ITEM_SHEET_MFG by id ${id} Failed: No data found`,
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_SHEET_MFG by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search ITEM_SHEET_MFG by id ${id} Error: ` + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_SHEET_MFG Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_SHEET_MFG data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_SHEET_MFG Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateItemSheetMfgDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_SHEET_MFG by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Update ITEM_SHEET_MFG by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Update ITEM_SHEET_MFG by id ${id} Error: ` + error.message);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Delete ITEM_SHEET_MFG by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Delete ITEM_SHEET_MFG by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Delete ITEM_SHEET_MFG by id ${id} Error: ` + error.message);
    }
  }
}
