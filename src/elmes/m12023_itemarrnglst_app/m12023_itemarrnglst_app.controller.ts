import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { M12023ItemarrnglstAppService } from './m12023_itemarrnglst_app.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('m12023-itemarrnglst-app')
export class M12023ItemarrnglstAppController {
    constructor(
        private readonly m12023ItemarrnglstAppService: M12023ItemarrnglstAppService,
    ) {}

    @Get()
    findAll() {
        return this.m12023ItemarrnglstAppService.findAll();
    }

    @Get(':order')
    findOne(@Param('order') order: string) {
        return this.m12023ItemarrnglstAppService.findOne(order);
    }

    @Post('search')
    @UseTransaction('elmesConnection')
    async search(@Body() dto: FiltersDto) {
        return this.m12023ItemarrnglstAppService.search(dto);
    }
}
