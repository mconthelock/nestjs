import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineLocationMstService } from './PILINE_LOCATION_MST.service';
import { CreatePilineLocationMstDto } from './dto/CREATE-PILINE_LOCATION_MST.dto';
import { UpdatePilineLocationMstDto } from './dto/UPDATE-PILINE_LOCATION_MST.dto';
import { KeyPilineLocationMstDto } from './dto/KEY-PILINE_LOCATION_MST.dto';

@Controller('workload/piline_location_mst')
export class PilineLocationMstController {
    constructor(private readonly service: PilineLocationMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineLocationMstDto) {
        return this.service.create(dto);
    }
    @Patch(':LOCATION_ID')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineLocationMstDto,
        @Body() dto: UpdatePilineLocationMstDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':LOCATION_ID')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineLocationMstDto) {
        return this.service.remove(key);
    }
}
