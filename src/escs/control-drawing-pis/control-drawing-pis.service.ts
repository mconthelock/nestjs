import { Injectable } from '@nestjs/common';
import { CreateControlDrawingPisDto } from './dto/create-control-drawing-pis.dto';
import { UpdateControlDrawingPisDto } from './dto/update-control-drawing-pis.dto';
import { ControlDrawingPisRepository } from './control-drawing-pis.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class ControlDrawingPisService {
    constructor(private readonly repo: ControlDrawingPisRepository) {}
      async create(dto: CreateControlDrawingPisDto) {
        try {
          const res = await this.repo.create(dto);
          if (!res) {
            return {
              status: false,
              message: 'Insert CONTROL_DRAWING_PIS Failed',
              data: dto,
            };
          }
          return {
            status: true,
            message: 'Insert CONTROL_DRAWING_PIS Successfully',
            data: res,
          };
        } catch (error) {
          throw new Error('Insert CONTROL_DRAWING_PIS Error: ' + error.message);
        }
      }
    
      async findAll() {
        try {
          const res = await this.repo.findAll();
          const length = res.length;
          if (length === 0) {
            return {
              status: false,
              message: 'Search CONTROL_DRAWING_PIS Failed: No data found',
              data: [],
            };
          }
          return {
            status: true,
            message: `Search CONTROL_DRAWING_PIS data found ${length} record(s)`,
            data: res,
          };
        } catch (error) {
          throw new Error('Search CONTROL_DRAWING_PIS Error: ' + error.message);
        }
      }
    
      async findOne(id: number) {
        try {
          const res = await this.repo.findOne(id);
          if (res == null) {
            return {
              status: false,
              message: `Search CONTROL_DRAWING_PIS by id ${id} Failed: No data found`,
              data: [],
            };
          }
          return {
            status: true,
            message: `Search CONTROL_DRAWING_PIS by id ${id} data found 1 record(s)`,
            data: res,
          };
        } catch (error) {
          throw new Error(
            `Search CONTROL_DRAWING_PIS by id ${id} Error: ` + error.message,
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
              message: 'Search CONTROL_DRAWING_PIS Failed: No data found',
              data: [],
            };
          }
          return {
            status: true,
            message: `Search CONTROL_DRAWING_PIS data found ${length} record(s)`,
            data: res,
          };
        } catch (error) {
          throw new Error('Search CONTROL_DRAWING_PIS Error: ' + error.message);
        }
      }
    
      async update(id: number, dto: UpdateControlDrawingPisDto) {
        try {
          const res = await this.repo.update(id, dto);
          if (res.affected === 0) {
            return {
              status: false,
              message: `Update CONTROL_DRAWING_PIS by id ${id} Failed`,
            };
          }
          return {
            status: true,
            message: `Update CONTROL_DRAWING_PIS by id ${id} Successfully`,
            data: res,
          };
        } catch (error) {
          throw new Error(
            `Update CONTROL_DRAWING_PIS by id ${id} Error: ` + error.message,
          );
        }
      }
    
      async remove(id: number) {
        try {
          const res = await this.repo.remove(id);
          if (res.affected === 0) {
            return {
              status: false,
              message: `Delete CONTROL_DRAWING_PIS by id ${id} Failed`,
            };
          }
          return {
            status: true,
            message: `Delete CONTROL_DRAWING_PIS by id ${id} Successfully`,
            data: res,
          };
        } catch (error) {
          throw new Error(
            `Delete CONTROL_DRAWING_PIS by id ${id} Error: ` + error.message,
          );
        }
      }
}
