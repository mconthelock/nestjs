import { Controller, Get } from '@nestjs/common';
import { DpmsPackingListService } from './dpms_packing_list.service';
import { CreateDpmsPackingListDto } from './dto/create-dpms_packing_list.dto';
import { UpdateDpmsPackingListDto } from './dto/update-dpms_packing_list.dto';

@Controller('workload/dpms-packing-list')
export class DpmsPackingListController {
    constructor(private readonly service: DpmsPackingListService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('current')
    getCurrentTasks() {
        return this.service.getCurrentTasks();
    }

    @Get('finish')
    getFinishTasks() {
        return this.service.getFinishTasks();
    }
}
