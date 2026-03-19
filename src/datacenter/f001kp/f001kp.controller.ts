import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { F001kpService } from './f001kp.service';
import { CreateF001kpDto } from './dto/create-f001kp.dto';
import { UpdateF001kpDto } from './dto/update-f001kp.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('datacenter/f001kp')
export class F001kpController {
    constructor(private readonly f001kpService: F001kpService) {}

    @Get()
    findAll() {
        return this.f001kpService.findAll();
    }

    @Get(':controlNo')
    findOne(@Param('controlNo') controlNo: string) {
        return this.f001kpService.findOne(controlNo);
    }

    @Post('search')
    @UseTransaction('datacenterConnection')
    search(@Body() dto: FiltersDto) {
        return this.f001kpService.search(dto);
    }
}
