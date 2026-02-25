import { Injectable } from '@nestjs/common';
import { CreateItemMfgDto } from './dto/create-item-mfg.dto';
import { UpdateItemMfgDto } from './dto/update-item-mfg.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ItemMfgRepository } from './item-mfg.repository';
import { ItemMfgDeleteService } from '../item-mfg-delete/item-mfg-delete.service';
import { ItemSheetMfgService } from '../item-sheet-mfg/item-sheet-mfg.service';
import { ControlDrawingPisService } from '../control-drawing-pis/control-drawing-pis.service';
import { ItemMfgListService } from '../item-mfg-list/item-mfg-list.service';
import { ItemMfgHistoryService } from '../item-mfg-history/item-mfg-history.service';

@Injectable()
export class ItemMfgService {
  constructor(
    private readonly repo: ItemMfgRepository,
    private readonly itemMfgListService: ItemMfgListService,
    private readonly itemMfgHistoryService: ItemMfgHistoryService,
    private readonly itemSheetMfgService: ItemSheetMfgService,
    private readonly itemMfgDeleteService: ItemMfgDeleteService,
    private readonly controlDrawingPisService: ControlDrawingPisService,
  ) {}
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
          message: 'Search ITEM_MFG Failed: No data found',
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
          message: `Search ITEM_MFG by id ${id} Failed: No data found`,
          data: [],
        };
      }
      return {
        status: true,
        message: `Search ITEM_MFG by id ${id} data found 1 record(s)`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Search ITEM_MFG by id ${id} Error: ` + error.message);
    }
  }

  async search(dto: FiltersDto) {
    try {
      const res = await this.repo.search(dto);
      const length = res.length;
      if (length === 0) {
        return {
          status: false,
          message: 'Search ITEM_MFG Failed: No data found',
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

  async update(itemId: number, dto: UpdateItemMfgDto) {
    try {
      // update item mfg
      const res = await this.repo.update(itemId, dto);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Update ITEM_MFG by id ${itemId} Failed`,
        };
      }
      if (dto.NSTATUS != null) {
        const data = {
          NSTATUS: dto.NSTATUS,
          NUSERUPDATE: dto.NUSERUPDATE,
          DDATEUPDATE: dto.DDATEUPDATE,
        };
        // update item sheet
        const sheetRes = await this.itemSheetMfgService.updateByItemId(
          itemId,
          data,
        );

        const itemList = await this.itemMfgListService.search({
          filters: [{ field: 'NITEMID', op: 'eq', value: itemId }],
        });

        // update item mfg list
        const itemListRes = await this.itemMfgListService.updateByItemId(
          itemId,
          data,
        );

        if (itemList.status) {
          for (const item of itemList.data) {
            const itemListId = item.NID;
            if (item.HISTORY.length > 0 && item.NSTATUS != 3) {
              console.log(item);

              // update item history
              const hisRes =
                await this.itemMfgHistoryService.updateByItemListId(
                  itemListId,
                  data,
                );
            }
          }
        }
        // update item mfg delete
        const deleteRes = await this.itemMfgDeleteService.updateByItemId(
          itemId,
          data,
        );
        // update control drawing pis
        const controlRes = await this.controlDrawingPisService.updateByItemId(
          itemId,
          data,
        );
      }

      return {
        status: true,
        message: `Update ITEM_MFG by id ${itemId} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(
        `Update ITEM_MFG by id ${itemId} Error: ` + error.message,
      );
    }
  }

  async remove(id: number) {
    try {
      const res = await this.repo.remove(id);
      if (res.affected === 0) {
        return {
          status: false,
          message: `Delete ITEM_MFG by id ${id} Failed`,
        };
      }
      return {
        status: true,
        message: `Delete ITEM_MFG by id ${id} Successfully`,
        data: res,
      };
    } catch (error) {
      throw new Error(`Delete ITEM_MFG by id ${id} Error: ` + error.message);
    }
  }
}
