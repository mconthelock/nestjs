import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ResultChkDwgService } from './resultchkdwg.service';
import { CreateResultchkdwgDto } from './dto/create-resultchkdwg.dto';
import { UpdateResultchkdwgDto } from './dto/update-resultchkdwg.dto';

@Controller('resultchkdwg')
export class ResultchkdwgController {
    constructor(private readonly resultchkdwgService: ResultChkDwgService) {}

    @Post()
    create(@Body() createResultchkdwgDto: CreateResultchkdwgDto) {
        return this.resultchkdwgService.create(createResultchkdwgDto);
    }

    @Get()
    findAll() {
        return this.resultchkdwgService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resultchkdwgService.findOne(+id);
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateResultchkdwgDto: UpdateResultchkdwgDto,
    // ) {
    //     return this.resultchkdwgService.update(+id, updateResultchkdwgDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.resultchkdwgService.remove(+id);
    }
}
