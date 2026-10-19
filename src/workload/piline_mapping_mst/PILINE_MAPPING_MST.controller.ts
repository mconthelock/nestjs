import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineMappingMstService } from './PILINE_MAPPING_MST.service';
import { CreatePilineMappingMstDto } from './dto/CREATE-PILINE_MAPPING_MST.dto';
import { UpdatePilineMappingMstDto } from './dto/UPDATE-PILINE_MAPPING_MST.dto';
import { KeyPilineMappingMstDto } from './dto/KEY-PILINE_MAPPING_MST.dto';

@Controller('workload/piline_mapping_mst')
export class PilineMappingMstController {
    constructor(private readonly service: PilineMappingMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseTransaction('workloadConnection')
    create(@Body() dto: CreatePilineMappingMstDto) {
        return this.service.create(dto);
    }
    @Patch(':MAP_ID')
    @UseTransaction('workloadConnection')
    update(
        @Param() key: KeyPilineMappingMstDto,
        @Body() dto: UpdatePilineMappingMstDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':MAP_ID')
    @UseTransaction('workloadConnection')
    remove(@Param() key: KeyPilineMappingMstDto) {
        return this.service.remove(key);
    }
}
