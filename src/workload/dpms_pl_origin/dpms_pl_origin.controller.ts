import { Controller, Get, Param } from '@nestjs/common';
import { DpmsPlOriginService } from './dpms_pl_origin.service';

@Controller('workload/dpms-pl-origin')
export class DpmsPlOriginController {
    constructor(private readonly service: DpmsPlOriginService) {}

    @Get('order/:id')
    order(@Param('id') id: string) {
        return this.service.find(+id,1);
    }

    @Get('case/:id')
    case(@Param('id') id: string) {
        return this.service.find(+id,2);
    }

    @Get('detail/:id')
    detail(@Param('id') id: string) {
        return this.service.find(+id,3);
    }

    @Get('id/:id')
    id(@Param('id') id: string) {
        return this.service.find(+id);
    }

    @Get('editOrigin/:id')
    editOrigin(@Param('id') id: string) {
        return this.service.editOrigin(+id);
    }
}
