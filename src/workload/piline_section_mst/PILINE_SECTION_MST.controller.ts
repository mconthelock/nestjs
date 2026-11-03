import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { PilineSectionMstService } from './PILINE_SECTION_MST.service';
import { CreatePilineSectionMstDto } from './dto/CREATE-PILINE_SECTION_MST.dto';
import { UpdatePilineSectionMstDto } from './dto/UPDATE-PILINE_SECTION_MST.dto';
import { KeyPilineSectionMstDto } from './dto/KEY-PILINE_SECTION_MST.dto';

@Controller('workload/piline_section_mst')
export class PilineSectionMstController {
    constructor(private readonly service: PilineSectionMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseTransaction('mitsuConnection')
    create(@Body() dto: CreatePilineSectionMstDto) {
        return this.service.create(dto);
    }
    @Patch(':SSECCODE')
    @UseTransaction('mitsuConnection')
    update(
        @Param() key: KeyPilineSectionMstDto,
        @Body() dto: UpdatePilineSectionMstDto,
    ) {
        return this.service.update(key, dto);
    }
    @Delete(':SSECCODE')
    @UseTransaction('mitsuConnection')
    remove(@Param() key: KeyPilineSectionMstDto) {
        return this.service.remove(key);
    }
}
