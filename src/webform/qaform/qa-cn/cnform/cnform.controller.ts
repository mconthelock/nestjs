import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CnformService } from './cnform.service';
import { CreateCnformDto } from './dto/create-cnform.dto';
import { UpdateCnformDto } from './dto/update-cnform.dto';

@Controller('cnform')
export class CnformController {
    constructor(private readonly cnformService: CnformService) {}

    @Post()
    create(@Body() createCnformDto: CreateCnformDto) {
        return this.cnformService.create(createCnformDto);
    }

    @Get()
    findAll() {
        return this.cnformService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cnformService.findOne(+id);
    }

    //   @Patch(':id')
    //   update(@Param('id') id: string, @Body() updateCnformDto: UpdateCnformDto) {
    //     return this.cnformService.update(+id, updateCnformDto);
    //   }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cnformService.remove(+id);
    }
}
