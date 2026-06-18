import { Injectable } from '@nestjs/common';
import { CreateFxaLocmstDto } from './dto/create-fxa_locmst.dto';
import { UpdateFxaLocmstDto } from './dto/update-fxa_locmst.dto';
import { FXALOCMSTRepository } from './fxa_locmst.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class FxaLocmstService {
  constructor(
    private readonly repo: FXALOCMSTRepository
) {}


  async create(dto: CreateFxaLocmstDto) {
    
    const isExist = await this.repo.findOne(dto.LOCCODE);
    if (isExist) {
        return {
                    status: false,
                    message: 'Location code is conflict',
            };
    }
    try {
            const res = await this.repo.insertLocation(dto);
            if(!res){
                throw new Error('Failed to Insert Location Master');
            }
            return { 
                status: true,
                message: 'Insert Location Master Successfully',
            };
        } catch (error) {
            throw new Error('Insert Location Master Error: ' + error.message);
        }
    

  }

  async import(dtos: CreateFxaLocmstDto[]){
        try {
            const res = await this.repo.importLocation(dtos);
            if(!res){
                throw new Error('Failed to Import Location Master');
            }
            return { 
                status: true,
                message: 'Import Location Master Successfully',
            };
        } catch (error) {
            throw new Error('Import Location Master Error: ' + error.message);
        }

  }

  async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search Location Master Failed: No data found',
                    data: [],
                };
            }
            for (const d of res){
                
            }
            return {
                status: true,
                message: `Search Location Master data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search Location Master Error: ' + error.message);
        }
  }


  findOne(id: number) {
    return `This action returns a #${id} fxaLocmst`;
  }

  async update(locCode: string, updateDto: UpdateFxaLocmstDto) {
    try {
      // เรียกใช้ Repository ที่เราเพิ่งเขียนไป
      const isSuccess = await this.repo.updateLocation(locCode, updateDto);
      
      if (!isSuccess) {
        return {
            status: false,
            message: `Location Code ${locCode} not found`,
        };
      }

      return { 
          status: true,
          message: 'Update Location Master Successfully',
      };

    } catch (error) {
      return {
          status: false,
          message: 'Update Location Master Error: ' + error.message,
      };
    }
}

//   update(id: number, updateFxaLocmstDto: UpdateFxaLocmstDto) {
//     return `This action updates a #${id} fxaLocmst`;
//   }

  remove(id: number) {
    return `This action removes a #${id} fxaLocmst`;
  }

  async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search Location Master Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search Location Master data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search Location Master Error: ' + error.message);
        }
    }



}
