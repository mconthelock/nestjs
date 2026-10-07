import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PurvmmScmusrService } from './purvmm_scmusr.service';
import { CreatePurVmmScmusrDto } from './dto/create-purvmm_scmusr.dto';
import { UpdatePurvmmScmusrDto } from './dto/update-purvmm_scmusr.dto';

@Controller('purform/purvmm-scmusr')
export class PurvmmScmusrController {
    constructor(private readonly purvmmScmusrService: PurvmmScmusrService) {}

    @Post()
    create(@Body() createPurvmmScmusrDto: CreatePurVmmScmusrDto) {
        return this.purvmmScmusrService.create(createPurvmmScmusrDto);
    }

    @Get()
    findAll() {
        return this.purvmmScmusrService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.purvmmScmusrService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePurvmmScmusrDto: UpdatePurvmmScmusrDto,
    ) {
        return this.purvmmScmusrService.update(+id, updatePurvmmScmusrDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.purvmmScmusrService.remove(+id);
    }
}
