import { Injectable } from '@nestjs/common';
import { CreateItemSheetMfgDto } from './dto/create-item-sheet-mfg.dto';
import { UpdateItemSheetMfgDto } from './dto/update-item-sheet-mfg.dto';
import { ItemSheetMfgRepository } from './item-sheet-mfg.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMfgListService } from '../item-mfg-list/item-mfg-list.service';
import { ItemMfgHistoryService } from '../item-mfg-history/item-mfg-history.service';

@Injectable()
export class ItemSheetMfgService {
  constructor(
    private readonly repo: ItemSheetMfgRepository,
    private readonly itemMfgListService: ItemMfgListService,
    private readonly itemMfgHistoryService: ItemMfgHistoryService,
  ) {}
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
      throw new Error(
        `Search ITEM_SHEET_MFG by id ${id} Error: ` + error.message,
      );
    }
  }

  async findByItemId(itemId: number) {
    try {
      const res = await this.repo.findByItemId(itemId);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: `Search ITEM_SHEET_MFG by itemId ${itemId} Failed: No data found`,
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_SHEET_MFG by itemId ${itemId} data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search ITEM_SHEET_MFG by itemId ${itemId} Error: ` + error.message,
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
      const update = await this.repo.update(id, dto);
      if (update.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_SHEET_MFG by id ${id} Failed`,
        };
      }
      if (dto.NSTATUS != null && dto.NSTATUS != 1) {
        const itemlist = await this.itemMfgListService.search({
          filters: [
            {
              field: 'NSHEETID',
              op: 'eq',
              value: id,
            },
          ],
        });
        if (itemlist.data.length > 0) {
          const data = {
            NSTATUS: dto.NSTATUS,
            NUSERUPDATE: dto.NUSERUPDATE,
            DDATEUPDATE: dto.DDATEUPDATE,
          };
          await this.itemMfgListService.updateBySheetId(id, data);
          for (const item of itemlist.data) {
            await this.itemMfgHistoryService.updateByItemListId(item.NID, data);
          }
        }
      }

      return {
        status: true,
        message: `Update ITEM_SHEET_MFG by id ${id} Successfully`,
        data: update,
      };
    } catch (error) {
      throw new Error(
        `Update ITEM_SHEET_MFG by id ${id} Error: ` + error.message,
      );
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
      throw new Error(
        `Delete ITEM_SHEET_MFG by id ${id} Error: ` + error.message,
      );
    }
  }
}
