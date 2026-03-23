import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { F002kpService } from './f002kp.service';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('datacenter/f002kp')
export class F002kpController {
    constructor(private readonly f002kpService: F002kpService) {}

    @Get()
    findAll() {
        return this.f002kpService.findAll();
    }

    @Get(':controlNo')
    findOne(@Param('controlNo') controlNo: string) {
        return this.f002kpService.findOne(controlNo);
    }

    @Post('search')
    @UseTransaction('datacenterConnection')
    search(@Body() dto: FiltersDto) {
        return this.f002kpService.search(dto);
    }
}
