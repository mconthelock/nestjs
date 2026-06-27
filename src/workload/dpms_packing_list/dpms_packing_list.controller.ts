import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { DpmsPackingListService } from './dpms_packing_list.service';
import { searchDpmsPackingListDto } from './dto/search_dpms_packing_list.dto';
import { getFileUploadInterceptor } from 'src/common/helpers/file-upload.helper';

@Controller('workload/dpms-packing-list')
export class DpmsPackingListController {
    constructor(private readonly service: DpmsPackingListService) {}

    @Get('all')
    findAll() {
        return this.service.getPackingList('all');
    }

    @Get('current')
    getCurrentTasks() {
        return this.service.getPackingList('current');
    }

    @Get('finish')
    getFinishTasks() {
        return this.service.getPackingList('finish');
    }

    @Get('for-search')
    getForSearch() {
        return this.service.getForSearch();
    }

    @Post('search')
    @UseInterceptors(getFileUploadInterceptor())
    search(@Body() dto: searchDpmsPackingListDto) {
        return this.service.getPackingList('search', dto);
    }
}
