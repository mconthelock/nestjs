import { Injectable } from '@nestjs/common';
import { CreateDpmsPackingListDto } from './dto/create-dpms_packing_list.dto';
import { UpdateDpmsPackingListDto } from './dto/update-dpms_packing_list.dto';
import { DpmsPackingListRepository } from './dpms_packing_list.repository';

@Injectable()
export class DpmsPackingListService {
    constructor(private readonly repo: DpmsPackingListRepository) {}

    async findAll(){
        try{
            const res = await this.repo.findAll();
            if(res.length === 0){
                return {
                    status: false,
                    message: 'Search DPMS packing list Failed: No data found',
                };
            }
            return {
                status: true,
                message: `Search DPMS packing list data found ${res.length} record(s)`,
                data: res,
            }
        } catch(error){
            throw new Error('Find Packing list data Failed: ' + error.message);
        }
    }
}
