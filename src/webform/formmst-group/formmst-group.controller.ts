import { Controller, Get, Post, Body } from '@nestjs/common';
import { FormmstGroupService } from './formmst-group.service';
import { CreateFormmstGroupDto } from './dto/create-formmst-group.dto';
import { UpdateFormmstGroupDto } from './dto/update-formmst-group.dto';

@Controller('webform/formmst-group')
export class FormmstGroupController {
    constructor(private readonly group: FormmstGroupService) {}

    @Get()
    findAll() {
        return this.group.findAll();
    }

    @Post()
    create(@Body() createFormmstGroupDto: CreateFormmstGroupDto) {
        return this.group.create(createFormmstGroupDto);
    }
}
