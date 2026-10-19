import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineAttService } from './PILINE_ATT.service';
import { CreatePilineAttDto } from './dto/CREATE-PILINE_ATT.dto';
import { UpdatePilineAttDto } from './dto/UPDATE-PILINE_ATT.dto';
import { KeyPilineAttDto } from './dto/KEY-PILINE_ATT.dto';

@Controller('workload/piline_att')
export class PilineAttController {
    constructor(private readonly service: PilineAttService) {}
    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineAttDto) {
        return this.service.create(dto);
    }
    @Patch(':PILINE_NO/:SEQ/:TYPEFILE')
    @UseTransaction('workloadConnection')
    update(@Param() key: KeyPilineAttDto, @Body() dto: UpdatePilineAttDto) {
        return this.service.update(key, dto);
    }
    @Delete(':PILINE_NO/:SEQ/:TYPEFILE')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineAttDto) {
        return this.service.remove(key);
    }
}
