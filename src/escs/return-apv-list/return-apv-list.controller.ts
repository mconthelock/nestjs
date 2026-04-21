import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ReturnApvListService } from './return-apv-list.service';
import { CreateReturnApvListDto } from './dto/create-return-apv-list.dto';
import { UpdateReturnApvListDto } from './dto/update-return-apv-list.dto';

@Controller('escs/return-apv-list')
export class ReturnApvListController {
    constructor(private readonly returnApvListService: ReturnApvListService) {}

    @Post()
    return(@Body() dto: CreateReturnApvListDto) {
        return this.returnApvListService.return(dto);
    }

    @Patch()
    update(@Body() dto: UpdateReturnApvListDto) {
        return this.returnApvListService.upsert(dto);
    }
}
