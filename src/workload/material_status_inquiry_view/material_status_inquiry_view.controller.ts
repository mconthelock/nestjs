import { Body, Controller, Post } from '@nestjs/common';
import { MaterialStatusInquiryViewService } from './material_status_inquiry_view.service';
import { DataTableServerSideDto } from 'src/common/dto/dataTable-server-side.dto';

@Controller('workload/material-status-inquiry-view')
export class MaterialStatusInquiryViewController {
    constructor(private readonly service: MaterialStatusInquiryViewService) {}

    @Post('server-side')
    findByDataTableServerside(@Body() dto: DataTableServerSideDto) {
        return this.service.findByDataTableServerside(dto);
    }
}
