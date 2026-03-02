import { Injectable } from '@nestjs/common';
import { CreateMfgDrawingCheckSheetDto } from './dto/create-mfg-drawing.dto';
import { UpdateMfgDrawingDto } from './dto/update-mfg-drawing.dto';
import { ItemMfgListService } from '../item-mfg-list/item-mfg-list.service';
import { ItemMfgService } from '../item-mfg/item-mfg.service';
import { ItemMfgDeleteService } from '../item-mfg-delete/item-mfg-delete.service';
import { IdtagEfacLogService } from 'src/workload/idtag-efac-log/idtag-efac-log.service';

@Injectable()
export class MfgDrawingCreateChecksheetService {
  constructor(
    private readonly itemMfgService: ItemMfgService,
    private readonly itemMfgListService: ItemMfgListService,
    private readonly itemMfgDeleteService: ItemMfgDeleteService,
    private readonly idtagEfacLogService: IdtagEfacLogService,
  ) {}

  private readonly mapType = {
    1: 'default',
    2: 'pisMulti',
    3: 'multi',
  };

  async create(dto: CreateMfgDrawingCheckSheetDto) {
    try {
      const state = {
        type: null,
        typeName: null,
        itemMfg: null,
        list: null,
        delete: null,
      };
      const item = await this.itemMfgService.findOne(dto.NITEMID);
      if (!item.status) {
        throw new Error(`Item Mfg with id ${dto.NITEMID} not found`);
      }

      state.type = item.data.NTYPE;
      state.typeName = this.mapType[item.data.NTYPE] || 'unknown';
      state.itemMfg = item.data;

      if (state.type !== 3) {
        const itemlist = await this.itemMfgListService.search({
          filters: [
            { field: 'NITEMID', op: 'eq', value: dto.NITEMID },
            { field: 'NSTATUS', op: 'eq', value: 1 },
          ],
        });
        if (!itemlist.status) {
          throw new Error(
            `Item Mfg List with item id ${dto.NITEMID} not found`,
          );
        }
        state.list = itemlist.data;
        const deleteList = await this.itemMfgDeleteService.search({
          filters: [
            { field: 'NITEMID', op: 'eq', value: dto.NITEMID },
            { field: 'NSTATUS', op: 'eq', value: 1 },
          ],
        });
        if (deleteList.status) {
          state.delete = deleteList.data;
        }
      }
      const drawing = await this.getDrawing({ serialNo: dto.ASERIALNO, pis: dto.VPIS });

      return state;
    } catch (error) {
      throw new Error('Create Checksheet Failed: ' + error.message);
    }
  }

  async getDrawing({serialNo, pis}: {serialNo: string[], pis?: string}): Promise<string> {
    const idtagLog = await this.idtagEfacLogService.search({
      filters: [
        { field: 'LOT_NO', op: 'eq', value: serialNo[0] },
      ],
    });
    console.log(idtagLog);
    
    return 'This action returns a string';
  }
}
