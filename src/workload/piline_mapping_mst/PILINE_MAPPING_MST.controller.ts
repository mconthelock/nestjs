import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
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
    create(@Body() dto: CreatePilineMappingMstDto) {
        return this.service.create(dto);
    }
    @Patch(':MAP_ID')
    update(@Param() key: KeyPilineMappingMstDto, @Body() dto: UpdatePilineMappingMstDto) {
        return this.service.update(key, dto);
    }
    @Delete(':MAP_ID')
    remove(@Param() key: KeyPilineMappingMstDto) {
        return this.service.remove(key);
    }
}
