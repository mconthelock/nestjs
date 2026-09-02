import { Body, Controller, Post } from '@nestjs/common';
import { OriginMasterMarViewService } from './origin_master_mar_view.service';
import { SearchOriginMasterMarViewDto } from './dto/search.dto';

@Controller('workload/origin-master-mar-view')
export class OriginMasterMarViewController {
    constructor(private readonly service: OriginMasterMarViewService) {}

    @Post()
    async getOriginMasterMarView(@Body() dto: SearchOriginMasterMarViewDto[]) {
        return this.service.getOriginMasterMarView(dto);
    }
}
