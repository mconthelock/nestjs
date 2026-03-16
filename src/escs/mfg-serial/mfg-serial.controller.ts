import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { MfgSerialService } from './mfg-serial.service';
import { CreateMfgSerialDto } from './dto/create-mfg-serial.dto';
import { UpdateMfgSerialDto } from './dto/update-mfg-serial.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('escs/mfg-serial')
export class MfgSerialController {
    constructor(private readonly mfgSerialService: MfgSerialService) {}

    @Post('search')
    @UseTransaction('escsConnection')
    async search(@Body() dto: FiltersDto) {
        return this.mfgSerialService.search(dto);
    }

    @Get()
    findAll() {
        return this.mfgSerialService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.mfgSerialService.findOne(+id);
    }
}
