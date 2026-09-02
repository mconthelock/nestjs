import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DpmsPlOriginService } from './dpms_pl_origin.service';
import { CreateDpmsPlOriginDto } from './dto/create-dpms_pl_origin.dto';

@Controller('workload/dpms-pl-origin')
export class DpmsPlOriginController {
    constructor(private readonly service: DpmsPlOriginService) {}

    @Get('order/:order')
    order(@Param('order') order: string) {
        return this.service.find({order, type: 'order'});
    }

    @Get('case/:order')
    case(@Param('order') order: string) {
        return this.service.find({order, type: 'case'});
    }

    @Get('detail/:order')
    detail(@Param('order') order: string) {
        return this.service.find({order, type: 'detail'});
    }

    @Get('id/:id')
    id(@Param('id') id: string) {
        return this.service.find({id: +id});
    }

    // @Get('editOrigin/:id')
    // editOrigin(@Param('id') id: string) {
    //     return this.service.editOrigin(+id);
    // }

    @Post()
    create(@Body() dto: CreateDpmsPlOriginDto) {
        return this.service.create(dto);
    }
}
