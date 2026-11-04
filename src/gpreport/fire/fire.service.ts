import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { FireItemMst } from 'src/common/Entities/gpreport/table/FIRE_ITEM_MST.entity';
import { FireRepository } from './fire.repository';
import { CreateFireItemDto } from './dto/create-fire-item.dto';
import { UpdateFireItemDto } from './dto/update-fire-item.dto';
import { SearchFireItemDto } from './dto/search-fire-item.dto';

@Injectable()
export class FireService {
    constructor(private readonly fireRepository: FireRepository) {}

    search(query: SearchFireItemDto) {
        return this.fireRepository.search(query);
    }

    async findOne(fireCode: string) {
        const item = await this.fireRepository.findOne(fireCode);
        if (!item) throw new NotFoundException('FIRE_ITEM_NOT_FOUND');
        return item;
    }

    async create(dto: CreateFireItemDto) {
        if (await this.fireRepository.findOne(dto.FIRE_CODE)) {
            throw new ConflictException('FIRE_CODE_ALREADY_EXISTS');
        }
        try {
            return await this.fireRepository.create({
                FIRE_CODE: dto.FIRE_CODE,
                ...this.mapData(dto),
            });
        } catch (error) {
            if (error?.driverError?.errorNum === 1 || error?.driverError?.code === 'ORA-00001') {
                throw new ConflictException('FIRE_CODE_ALREADY_EXISTS');
            }
            throw error;
        }
    }

    async update(fireCode: string, dto: UpdateFireItemDto) {
        const data = this.mapData(dto);
        if (!Object.keys(data).length) throw new BadRequestException('NO_FIELDS_TO_UPDATE');
        const result = await this.fireRepository.update(fireCode, data);
        if (!result.affected) throw new NotFoundException('FIRE_ITEM_NOT_FOUND');
        return this.findOne(fireCode);
    }

    async remove(fireCode: string) {
        const result = await this.fireRepository.delete(fireCode);
        if (!result.affected) throw new NotFoundException('FIRE_ITEM_NOT_FOUND');
        return { message: 'FIRE_ITEM_DELETED', FIRE_CODE: fireCode };
    }

    private mapData(dto: UpdateFireItemDto): Partial<FireItemMst> {
        const data: Partial<FireItemMst> = {};
        for (const field of ['LOCATION', 'FTYPE', 'CAPACITY', 'AREA', 'STATUS'] as const) {
            if (dto[field] !== undefined) data[field] = dto[field];
        }
        return data;
    }
}
