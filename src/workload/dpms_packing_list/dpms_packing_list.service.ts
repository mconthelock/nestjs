import { Injectable } from '@nestjs/common';
import { DpmsPackingListRepository } from './dpms_packing_list.repository';
import { DPMS_PACKING_LIST } from 'src/common/Entities/workload/views/DPMS_PACKING_LIST.entity';
import { searchDpmsPackingListDto } from './dto/search_dpms_packing_list.dto';

@Injectable()
export class DpmsPackingListService {
    constructor(private readonly repo: DpmsPackingListRepository) {}

    async getPackingList(type: 'all' | 'current' | 'finish' | 'search', condition?: searchDpmsPackingListDto) {
        try {
            let res: DPMS_PACKING_LIST[] = [];
            switch (type) {
                case 'all':
                    res = await this.repo.findAll();
                    break;
                case 'current':
                    res = await this.repo.getCurrentTasks();
                    break;
                case 'finish':
                    res = await this.repo.getFinishTasks();
                    break;
                case 'search':
                    res = await this.repo.search(condition);
                    break;
                default:
                    throw new Error('Invalid packing list type');
            }
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'Get DPMS packing list Failed: No data found',
                };
            }
            return {
                status: true,
                message: `Get DPMS packing list data found ${res.length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                'Get DPMS packing list data Failed: ' + error.message,
            );
        }
    }

    async getForSearch() {
        try {
            const data = await this.repo.findAll();
            if(data.length === 0) {
                return {
                    status: false,
                    message: 'Get data for search Failed: No data found',
                };
            }
            const prod = Array.from(new Set(data.map((item) => item.PROD)));
            const p = Array.from(new Set(data.map((item) => item.P)));
            const type = Array.from(new Set(data.map((item) => item.TYPE)));
            const serie = Array.from(new Set(data.filter((item) => item.SERIES).map((item) => item.SERIES)));
            const model = Array.from(new Set(data.filter((item) => item.MODEL_SPEC).map((item) => item.MODEL_SPEC)));
            const proj = Array.from(new Set(data.filter((item) => item.PROJECT).map((item) => item.PROJECT)));
            return {
                status: true,
                PROD: prod,
                P: p,
                TYPE: type,
                SERIES: serie,
                MODEL: model,
                PROJECT: proj,
            };
        } catch (error) {
            throw new Error(
                'Get data for search data Failed: ' + error.message,
            );
        }
    }
}
