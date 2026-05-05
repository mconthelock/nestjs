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
import {
    ActionReturnApvListDto,
    UpdateReturnApvListDto,
} from './dto/update-return-apv-list.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

@Controller('escs/return-apv-list')
export class ReturnApvListController {
    constructor(private readonly returnApvListService: ReturnApvListService) {}

    @Post()
    @UseTransaction('escsConnection')
    return(@Body() dto: CreateReturnApvListDto) {
        return this.returnApvListService.return(dto);
    }

    @Patch()
    @UseTransaction('escsConnection')
    actions(@Body() dto: ActionReturnApvListDto) {
        return this.returnApvListService.actions(dto);
    }

    @Get('sec/:sec')
    findBySec(@Param('sec') sec: string) {
        return this.returnApvListService.findBySec(+sec);
    }

    @Get('id/:id')
    findById(@Param('id') id: string) {
        return this.returnApvListService.findById(+id);
    }
}
