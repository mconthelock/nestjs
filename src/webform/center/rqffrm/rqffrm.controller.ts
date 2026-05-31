import {
    Controller,
    Get,
    Post,
    Body,
    Param,
} from '@nestjs/common';
import { RqffrmService } from './rqffrm.service';
import { FormDto } from '../form/dto/form.dto';

@Controller('rqffrm')
export class RqffrmController {
    constructor(private readonly rqffrmService: RqffrmService) {}

    @Post('data')
    async getData(@Body() dto: FormDto) {
        return await this.rqffrmService.getData(dto);
    }

    @Get(':FYear')
    async findFromYear(@Param('FYear') FYear: string) {
        return await this.rqffrmService.findFromYear(FYear);
    }
}
