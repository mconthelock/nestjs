import { Controller, Post, Body } from '@nestjs/common';
import { InquiryDetailService } from './inquiry-detail.service';
import { createDetailDto } from './dto/create.dto';
import { updateDetailDto } from './dto/update.dto';

@Controller('sp/detail')
export class InquiryDetailController {
    constructor(private readonly dt: InquiryDetailService) {}

    @Post('create')
    create(@Body() dto: createDetailDto) {
        return this.dt.create(dto);
    }

    @Post('update')
    update(@Body() dto: updateDetailDto) {
        return this.dt.update(dto);
    }
}
