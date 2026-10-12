import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineCauseMstService } from './PILINE_CAUSE_MST.service';
import { CreatePilineCauseMstDto } from './dto/CREATE-PILINE_CAUSE_MST.dto';
import { UpdatePilineCauseMstDto } from './dto/UPDATE-PILINE_CAUSE_MST.dto';
import { KeyPilineCauseMstDto } from './dto/KEY-PILINE_CAUSE_MST.dto';

@Controller('workload/piline_cause_mst')
export class PilineCauseMstController {
    constructor(private readonly service: PilineCauseMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineCauseMstDto) {
        return this.service.create(dto);
    }
    @Patch(':CAUSE_ID')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineCauseMstDto,
        @Body() dto: UpdatePilineCauseMstDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':CAUSE_ID')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineCauseMstDto) {
        return this.service.remove(key);
    }
}
