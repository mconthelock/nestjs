import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IetsListService } from './iets_list.service';
import { CreateIetsListDto } from './dto/create-iets_list.dto';
import { UpdateIetsListDto } from './dto/update-iets_list.dto';

@Controller('iets-list')
export class IetsListController {
    constructor(private readonly ietsListService: IetsListService) {}

    @Post()
    create(@Body() createIetsListDto: CreateIetsListDto) {
        return this.ietsListService.create(createIetsListDto);
    }

    @Get()
    findAll() {
        return this.ietsListService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ietsListService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateIetsListDto: UpdateIetsListDto) {
        return this.ietsListService.update(+id, updateIetsListDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ietsListService.remove(+id);
    }
}
