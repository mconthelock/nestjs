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

@Controller('mfg-serial')
export class MfgSerialController {
    constructor(private readonly mfgSerialService: MfgSerialService) {}

    @Post()
    create(@Body() dto: CreateMfgSerialDto) {
        return this.mfgSerialService.create(dto);
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
