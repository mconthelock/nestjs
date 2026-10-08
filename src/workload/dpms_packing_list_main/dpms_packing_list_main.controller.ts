import { Controller, Get, Param } from '@nestjs/common';
import { DpmsPackingListMainService } from './dpms_packing_list_main.service';

@Controller('workload/dpms-packing-list-main')
export class DpmsPackingListMainController {
    constructor(
        private readonly service: DpmsPackingListMainService,
    ) {}

    @Get(':mfgNo')
    findPackingListByMfgNo(@Param('mfgNo') mfgNo: string) {
        return this.service.findPackingListByMfgNo(mfgNo, false);
    }

    @Get('po/:mfgNo')
    findPackingListPoByMfgNo(@Param('mfgNo') mfgNo: string) {
        return this.service.findPackingListByMfgNo(mfgNo, true);
    }
}
