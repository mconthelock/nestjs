import { Controller, Post, Body } from '@nestjs/common';
import { ItemStationService } from './item-station.service';

@Controller('escs/item-station')
export class ItemStationController {
    constructor(private readonly itemStationService: ItemStationService) {}

    @Post('searchItemStation')
    async searchItemStation(@Body() dto: any) {
        return this.itemStationService.searchItemStation(dto);
    }
}
