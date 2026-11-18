import { Get } from '@nestjs/common';
import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { PilineInitialMstService } from './PILINE_INITIAL_MST.service';
import { CreatePilineInitialMstDto } from './dto/CREATE-PILINE_INITIAL_MST.dto';
import { UpdatePilineInitialMstDto } from './dto/UPDATE-PILINE_INITIAL_MST.dto';
import { KeyPilineInitialMstDto } from './dto/KEY-PILINE_INITIAL_MST.dto';

@Controller('workload/piline_initial_mst')
export class PilineInitialMstController {
    constructor(private readonly service: PilineInitialMstService) {}
    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    create(@Body() dto: CreatePilineInitialMstDto) {
        return this.service.create(dto);
    }
    @Patch(':INITIAL_ID')
    update(@Param() key: KeyPilineInitialMstDto, @Body() dto: UpdatePilineInitialMstDto) {
        return this.service.update(key, dto);
    }
    @Delete(':INITIAL_ID')
    remove(@Param() key: KeyPilineInitialMstDto) {
        return this.service.remove(key);
    }
}
