import { Injectable } from '@nestjs/common';
import { SearchItemDto } from './dto/search-escs-item.dto';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {
    constructor(private readonly repo: ItemRepository) {}

    getItemAll() {
        return this.repo.getItemAll();
    }

    getItemByItem(item: string) {
        return this.repo.getItemByItem(item);
    }

    getItem(searchDto: SearchItemDto) {
        return this.repo.getItem(searchDto);
    }
}
