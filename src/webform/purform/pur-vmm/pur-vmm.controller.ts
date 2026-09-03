import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { PurVmmService } from './pur-vmm.service';
import { CreatePurVmmDto } from './dto/create-pur-vmm.dto';
import { UpdatePurVmmDto } from './dto/update-pur-vmm.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from 'express';

@Controller('purform/pur-vmm')
export class PurVmmController {
    constructor(private readonly purVmmService: PurVmmService) {}

    @Post('createauto')
    async createauto(@Body() formEva: FormDto, @Req() req: Request) {
        const ip = getClientIP(req);
        return await this.purVmmService.createauto(formEva, ip);
    }

    @Post()
    create(@Body() createPurVmmDto: CreatePurVmmDto) {
        return this.purVmmService.create(createPurVmmDto);
    }

    @Get()
    findAll() {
        return this.purVmmService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.purVmmService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePurVmmDto: UpdatePurVmmDto) {
        return this.purVmmService.update(+id, updatePurVmmDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.purVmmService.remove(+id);
    }
}
