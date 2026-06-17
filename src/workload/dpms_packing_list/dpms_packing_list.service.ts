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

    async getCurrentTasks() {
        try {
            const res = await this.repo.getCurrentTasks();
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No current packing list tasks found',
                };
            }
            return {
                status: true,
                message: `Current packing list tasks found ${res.length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Failed to get current packing list tasks: ' + error.message);
        }
    }

    async getFinishTasks() {
        try {
            const res = await this.repo.getFinishTasks();
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No finished packing list tasks found',
                };
            }
            return {
                status: true,
                message: `Finished packing list tasks found ${res.length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Failed to get finished packing list tasks: ' + error.message);
        }
    }
}
