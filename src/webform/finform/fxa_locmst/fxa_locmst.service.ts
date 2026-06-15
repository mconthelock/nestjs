import { Injectable } from '@nestjs/common';
import { CreateFxaLocmstDto } from './dto/create-fxa_locmst.dto';
import { UpdateFxaLocmstDto } from './dto/update-fxa_locmst.dto';
import { FXALOCMSTRepository } from './fxa_locmst.repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Injectable()
export class FxaLocmstService {
  constructor(private readonly repo: FXALOCMSTRepository) {}
  create(createFxaLocmstDto: CreateFxaLocmstDto) {
    return 'This action adds a new fxaLocmst';
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

  update(id: number, updateFxaLocmstDto: UpdateFxaLocmstDto) {
    return `This action updates a #${id} fxaLocmst`;
  }

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
