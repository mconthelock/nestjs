import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PilineEventRecordService } from './PILINE_EVENT_RECORD.service';
import { CreatePilineEventRecordDto } from './dto/CREATE-PILINE_EVENT_RECORD.dto';
import { UpdatePilineEventRecordDto } from './dto/UPDATE-PILINE_EVENT_RECORD.dto';
import { KeyPilineEventRecordDto } from './dto/KEY-PILINE_EVENT_RECORD.dto';

@Controller('workload/piline_event_record')
export class PilineEventRecordController {
    constructor(private readonly service: PilineEventRecordService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('issue')
    findIssues() {
        return this.service.findAll(true);
    }

    @Post()
    create(@Body() dto: CreatePilineEventRecordDto) {
        return this.service.create(dto);
    }
    @Patch(':PILINE_NO')
    update(@Param() key: KeyPilineEventRecordDto, @Body() dto: UpdatePilineEventRecordDto) {
        return this.service.update(key, dto);
    }
    @Delete(':PILINE_NO')
    remove(@Param() key: KeyPilineEventRecordDto) {
        return this.service.remove(key);
    }
}
