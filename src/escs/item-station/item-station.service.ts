import { Injectable } from '@nestjs/common';
import { CreateESCSItemStationDto } from './dto/create-item-station.dto';
import { UpdateESCSItemStationDto } from './dto/update-item-station.dto';
import { QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ESCSItemStation } from './entities/item-station.entity';

@Injectable()
export class ESCSItemStationService {
    constructor(
        @InjectRepository(ESCSItemStation, 'amecConnection') 
        private readonly itemStationRepository: Repository<ESCSItemStation>,
    ) {}

    async searchItemStation(dto: UpdateESCSItemStationDto, queryRunner?: QueryRunner) {
        const repo = queryRunner ? queryRunner.manager.getRepository(ESCSItemStation) : this.itemStationRepository;
        return repo.find({
            where: dto,
            order: {
                ITS_NO: 'ASC',
            },
        });

    }
}
