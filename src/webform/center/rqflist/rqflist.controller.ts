import { Body, Controller, Post } from '@nestjs/common';
import { RqflistService } from './rqflist.service';
import { CreateRqflistDto } from './dto/create-rqflist.dto';
import { UpdateRqflistDto } from './dto/update-rqflist.dto';
import { FormDto } from '../form/dto/form.dto';

@Controller('rqflist')
export class RqflistController {
    constructor(private readonly rqflistService: RqflistService) {}

    @Post('findOne')
    findOne(@Body() form: FormDto) {
        return this.rqflistService.findOne(form);
    }
}
