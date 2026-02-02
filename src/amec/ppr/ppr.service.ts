import { Injectable } from '@nestjs/common';
import { CreatePprDto } from './dto/create-ppr.dto';
import { UpdatePprDto } from './dto/update-ppr.dto';
import { PPR } from 'src/common/Entities/amec/table/PPR.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PprService {
  constructor(
    @InjectRepository(PPR, 'webformConnection')
    private repo: Repository<PPR>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(pr: string) {
    return this.repo.findOneBy({ SPRNO: pr });
  }
}
