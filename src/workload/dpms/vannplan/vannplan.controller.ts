import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { VannplanService } from './vannplan.service';
import { CreateVannplanDto } from './dto/create-vannplan.dto';
import { UpdateVannplanDto } from './dto/update-vannplan.dto';
import { SearchVannplanDto } from './dto/search-vannplan.dto';

@Controller('workload/vannplan')
export class VannplanController {
    constructor(private readonly vannplanService: VannplanService) {}

    @Post('search')
    search(@Body() dto: SearchVannplanDto) {
        return this.vannplanService.search(dto);
    }
}
