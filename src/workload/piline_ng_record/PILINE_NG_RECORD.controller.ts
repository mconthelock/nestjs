import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PilineNgRecordService } from './PILINE_NG_RECORD.service';
import { CreatePilineNgRecordDto } from './dto/CREATE-PILINE_NG_RECORD.dto';
import { UpdatePilineNgRecordDto } from './dto/UPDATE-PILINE_NG_RECORD.dto';
import { KeyPilineNgRecordDto } from './dto/KEY-PILINE_NG_RECORD.dto';

@Controller('workload/piline_ng_record')
export class PilineNgRecordController {
    constructor(private readonly service: PilineNgRecordService) {}
    @Post()
    create(@Body() dto: CreatePilineNgRecordDto) {
        return this.service.create(dto);
    }
    @Patch(':PILINE_NO')
    update(@Param() key: KeyPilineNgRecordDto, @Body() dto: UpdatePilineNgRecordDto) {
        return this.service.update(key, dto);
    }
    @Delete(':PILINE_NO')
    remove(@Param() key: KeyPilineNgRecordDto) {
        return this.service.remove(key);
    }
}
