import { Injectable } from '@nestjs/common';
import { CreateItemStationDto } from './dto/create-item-station.dto';
import { UpdateItemStationDto } from './dto/update-item-station.dto';
import { ItemStationRepository } from './item-station.repository';

@Injectable()
export class ItemStationService {
    constructor(private readonly repo: ItemStationRepository) {}

    async searchItemStation(dto: UpdateItemStationDto) {
        return this.repo.searchItemStation(dto);
    }
}
