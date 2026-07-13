import { Body, Controller, Post } from '@nestjs/common';
import { DpmsPlDocRevService } from './dpms_pl_doc_rev.service';
import { CreateDpmsPlDocRevDto, SearchDpmsPlDocRevDto } from './dto/create-dpms_pl_doc_rev.dto';

@Controller('workload/dpms-pl-doc-rev')
export class DpmsPlDocRevController {
    constructor(private readonly service: DpmsPlDocRevService) {}

    @Post()
    async create(@Body() dto: CreateDpmsPlDocRevDto) {
        return this.service.create(dto);
    }

    @Post('get-list')
    async getList(@Body() dto: SearchDpmsPlDocRevDto) {
        return this.service.getList(dto);
    }
}
