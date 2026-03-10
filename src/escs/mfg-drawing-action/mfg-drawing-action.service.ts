import { Injectable } from '@nestjs/common';
import { CreateMfgDrawingActionDto } from './dto/create-mfg-drawing-action.dto';
import { UpdateMfgDrawingActionDto } from './dto/update-mfg-drawing-action.dto';
import { MfgDrawingActionRepository } from './mfg-drawing-action.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class MfgDrawingActionService {
  constructor(private readonly repo: MfgDrawingActionRepository) {}
   async create(dto: CreateMfgDrawingActionDto) {
     try {
       const res = await this.repo.create(dto);
       if (!res) {
         return {
           status: false,
           message: 'Insert MFG_DRAWING_ACTION Failed',
           data: dto,
         };
       }
       return {
         status: true,
         message: 'Insert MFG_DRAWING_ACTION Successfully',
         data: res,
       };
     } catch (error) {
       throw new Error('Insert MFG_DRAWING_ACTION Error: ' + error.message);
     }
   }
 
   async findAll() {
     try {
       const res = await this.repo.findAll();
       const length = res.length;
       if (length === 0) {
         return {
           status: false,
           message: 'Search MFG_DRAWING_ACTION Failed: No data found',
           data: [],
         };
       }
       return {
         status: true,
         message: `Search MFG_DRAWING_ACTION data found ${length} record(s)`,
         data: res,
       };
     } catch (error) {
       throw new Error('Search MFG_DRAWING_ACTION Error: ' + error.message);
     }
   }
 
   async findOne(id: number) {
     try {
       const res = await this.repo.findOne(id);
       if (res == null) {
         return {
           status: false,
           message: `Search MFG_DRAWING_ACTION by id ${id} Failed: No data found`,
           data: [],
         };
       }
       return {
         status: true,
         message: `Search MFG_DRAWING_ACTION by id ${id} data found 1 record(s)`,
         data: res,
       };
     } catch (error) {
       throw new Error(`Search MFG_DRAWING_ACTION by id ${id} Error: ` + error.message);
     }
   }
 
   async search(dto: FiltersDto) {
     try {
       const res = await this.repo.search(dto);
       const length = res.length;
       if (length === 0) {
         return {
           status: false,
           message: 'Search MFG_DRAWING_ACTION Failed: No data found',
           data: [],
         };
       }
       return {
         status: true,
         message: `Search MFG_DRAWING_ACTION data found ${length} record(s)`,
         data: res,
       };
     } catch (error) {
       throw new Error('Search MFG_DRAWING_ACTION Error: ' + error.message);
     }
   }
 
   async update(id: number, dto: UpdateMfgDrawingActionDto) {
     try {
       const res = await this.repo.update(id, dto);
       if (res.affected === 0) {
         return {
           status: false,
           message: `Update MFG_DRAWING_ACTION by id ${id} Failed`,
         };
       }
       return {
         status: true,
         message: `Update MFG_DRAWING_ACTION by id ${id} Successfully`,
         data: res,
       };
     } catch (error) {
       throw new Error(`Update MFG_DRAWING_ACTION by id ${id} Error: ` + error.message);
     }
   }
 
   async remove(id: number) {
     try {
       const res = await this.repo.remove(id);
       if (res.affected === 0) {
         return {
           status: false,
           message: `Delete MFG_DRAWING_ACTION by id ${id} Failed`,
         };
       }
       return {
         status: true,
         message: `Delete MFG_DRAWING_ACTION by id ${id} Successfully`,
         data: res,
       };
     } catch (error) {
       throw new Error(`Delete MFG_DRAWING_ACTION by id ${id} Error: ` + error.message);
     }
   }
}
