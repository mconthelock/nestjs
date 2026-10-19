import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineEventMstService } from './PILINE_EVENT_MST.service';
import { CreatePilineEventMstDto } from './dto/CREATE-PILINE_EVENT_MST.dto';
import { UpdatePilineEventMstDto } from './dto/UPDATE-PILINE_EVENT_MST.dto';
import { KeyPilineEventMstDto } from './dto/KEY-PILINE_EVENT_MST.dto';

@Controller('workload/piline_event_mst')
export class PilineEventMstController {
    constructor(private readonly service: PilineEventMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineEventMstDto) {
        return this.service.create(dto);
    }
    @Patch(':EVENT_ID')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineEventMstDto,
        @Body() dto: UpdatePilineEventMstDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':EVENT_ID')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineEventMstDto) {
        return this.service.remove(key);
    }
}
