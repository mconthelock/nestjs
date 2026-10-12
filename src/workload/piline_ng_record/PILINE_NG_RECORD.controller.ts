import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineNgRecordService } from './PILINE_NG_RECORD.service';
import { CreatePilineNgRecordDto } from './dto/CREATE-PILINE_NG_RECORD.dto';
import { UpdatePilineNgRecordDto } from './dto/UPDATE-PILINE_NG_RECORD.dto';
import { KeyPilineNgRecordDto } from './dto/KEY-PILINE_NG_RECORD.dto';

@Controller('workload/piline_ng_record')
export class PilineNgRecordController {
    constructor(private readonly service: PilineNgRecordService) {}
    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineNgRecordDto) {
        return this.service.create(dto);
    }
    @Patch(':PILINE_NO')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineNgRecordDto,
        @Body() dto: UpdatePilineNgRecordDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':PILINE_NO')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineNgRecordDto) {
        return this.service.remove(key);
    }
}
