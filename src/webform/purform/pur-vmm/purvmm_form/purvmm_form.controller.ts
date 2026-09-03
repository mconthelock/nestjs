import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PurvmmFormService } from './purvmm_form.service';
import { CreatePurvmmFormDto } from './dto/create-purvmm_form.dto';
import { UpdatePurvmmFormDto } from './dto/update-purvmm_form.dto';

@Controller('purform/purvmm-form')
export class PurvmmFormController {
    constructor(private readonly purvmmFormService: PurvmmFormService) {}

    @Post()
    create(@Body() createPurvmmFormDto: CreatePurvmmFormDto) {
        return this.purvmmFormService.create(createPurvmmFormDto);
    }

    @Get()
    findAll() {
        return this.purvmmFormService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.purvmmFormService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePurvmmFormDto: UpdatePurvmmFormDto,
    ) {
        return this.purvmmFormService.update(+id, updatePurvmmFormDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.purvmmFormService.remove(+id);
    }
}
