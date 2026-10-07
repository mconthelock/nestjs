import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AttcnfrmService } from './attcnfrm.service';
import { CreateAttcnfrmDto } from './dto/create-attcnfrm.dto';
import { UpdateAttcnfrmDto } from './dto/update-attcnfrm.dto';

@Controller('attcnfrm')
export class AttcnfrmController {
    constructor(private readonly attcnfrmService: AttcnfrmService) {}

    @Post()
    create(@Body() createAttcnfrmDto: CreateAttcnfrmDto) {
        return this.attcnfrmService.createAttcnfrm(createAttcnfrmDto);
    }

    @Get()
    findAll() {
        return this.attcnfrmService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.attcnfrmService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAttcnfrmDto: UpdateAttcnfrmDto,
    ) {
        return this.attcnfrmService.update(+id, updateAttcnfrmDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.attcnfrmService.remove(+id);
    }
}
