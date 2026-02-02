import { Injectable } from '@nestjs/common';
import { CreatePpoDto } from './dto/create-ppo.dto';
import { UpdatePpoDto } from './dto/update-ppo.dto';
import { PPO } from 'src/common/Entities/amec/table/PPO.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SearchPpoDto } from './dto/search-ppo.dto';

@Injectable()
export class PpoService {
  constructor(
    @InjectRepository(PPO, 'webformConnection')
    private repo: Repository<PPO>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(po: string) {
    return this.repo.findOneBy({ SPONO: po });
  }

  search(dto: SearchPpoDto) {
    return this.repo.findBy({
      ...dto,
    });
  }
}
