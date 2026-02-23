import { Injectable } from '@nestjs/common';
import { CreateItemMfgListDto } from './dto/create-item-mfg-list.dto';
import { UpdateItemMfgListDto } from './dto/update-item-mfg-list.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMfgListRepository } from './item-mfg-list.repository';
import { ItemMfgHistoryService } from '../item-mfg-history/item-mfg-history.service';

@Injectable()
export class ItemMfgListService {
  constructor(
    private readonly repo: ItemMfgListRepository,
    private readonly itemMfgHistoryService: ItemMfgHistoryService,
  ) {}
  async create(dto: CreateItemMfgListDto) {
    try {
      const res = await this.repo.create(dto);
      if (!res) {
        return {
          status: false,
          message: 'Insert ITEM_MFG_LIST Failed',
          data: dto,
        };
      }
      return {
        status: true,
        message: 'Insert ITEM_MFG_LIST Successfully',
        data: res,
      };
    } catch (error) {
      throw new Error('Insert ITEM_MFG_LIST Error: ' + error.message);
    }
  }

  async findAll() {
    try {
      const res = await this.repo.findAll();
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_MFG_LIST Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG_LIST data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_LIST Error: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.repo.findOne(id);
      if (res == null) {
        return {
          status: false,
          message: `Search ITEM_MFG_LIST by id ${id} Failed: No data found`,
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG_LIST by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Search ITEM_MFG_LIST by id ${id} Error: ` + error.message,
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
          message: 'Search ITEM_MFG_LIST Failed: No data found',
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG_LIST data found ${length} record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error('Search ITEM_MFG_LIST Error: ' + error.message);
    }
  }

  async update(id: number, dto: UpdateItemMfgListDto) {
    try {
      const res = await this.repo.update(id, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_MFG_LIST by id ${id} Failed`,
        };
      }

      if (dto.NSTATUS != null && dto.NSTATUS != 1) {
        const itemlist = await this.search({
          filters: [
            {
              field: 'NID',
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
          for (const item of itemlist.data) {
            await this.itemMfgHistoryService.updateByItemListId(item.NID, data);
          }
        }
      }
      return {
        status: true,
        message: `Update ITEM_MFG_LIST by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Update ITEM_MFG_LIST by id ${id} Error: ` + error.message,
      );
    }
  }

  async updateBySheetId(sheetId: number, dto: UpdateItemMfgListDto) {
    try {
      const res = await this.repo.updateBySheetId(sheetId, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_MFG_LIST by sheetId ${sheetId} Failed`,
        };
      }
      return {
        status: true,
        message: `Update ITEM_MFG_LIST by sheetId ${sheetId} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Update ITEM_MFG_LIST by sheetId ${sheetId} Error: ` + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Delete ITEM_MFG_LIST by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Delete ITEM_MFG_LIST by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Delete ITEM_MFG_LIST by id ${id} Error: ` + error.message,
      );
    }
  }
}
