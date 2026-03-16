import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MfgDrawingActionService } from './mfg-drawing-action.service';
import { CreateMfgDrawingActionDto } from './dto/create-mfg-drawing-action.dto';
import { UpdateMfgDrawingActionDto } from './dto/update-mfg-drawing-action.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/mfg-drawing-action')
export class MfgDrawingActionController {
    constructor(
        private readonly mfgDrawingActionService: MfgDrawingActionService,
    ) {}

    @Get()
    findAll() {
        return this.mfgDrawingActionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mfgDrawingActionService.findOne(+id);
    }

    @Post('search')
    @UseTransaction('escsConnection')
    async search(@Body() dto: FiltersDto) {
        return this.mfgDrawingActionService.search(dto);
    }
}
