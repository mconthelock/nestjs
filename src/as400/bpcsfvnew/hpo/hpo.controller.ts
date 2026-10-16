import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { HpoService } from './hpo.service';

@Controller('hpo')
export class HpoController {
    constructor(private readonly hpoService: HpoService) {}

    @Get()
    findAll() {
        return this.hpoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.hpoService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.hpoService.remove(+id);
    }
}
