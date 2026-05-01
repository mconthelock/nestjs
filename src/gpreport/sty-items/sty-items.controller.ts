import {
    Controller,
    Get,
} from '@nestjs/common';
import { StyItemsService } from './sty-items.service';
import { CreateStyItemDto } from './dto/create-sty-item.dto';
import { UpdateStyItemDto } from './dto/update-sty-item.dto';

@Controller('gpreport/sty-items')
export class StyItemsController {
    constructor(private readonly styItemsService: StyItemsService) {}

    @Get('patrol')
    getItemPatrol() {
        return this.styItemsService.getItemByTypecode('PT');
    }

    @Get('kyt')
    getItemKYT() {
        return this.styItemsService.getItemByTypecode('KYTR');
    }
}
