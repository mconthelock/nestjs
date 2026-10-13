import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
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

    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineEventRecordDto) {
        return this.service.create(dto);
    }
    @Patch(':PILINE_NO')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineEventRecordDto,
        @Body() dto: UpdatePilineEventRecordDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':PILINE_NO')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineEventRecordDto) {
        return this.service.remove(key);
    }
}
