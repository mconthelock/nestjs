import { Injectable } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CreateOrgpoDto } from './dto/create-orgpo.dto';
import { UpdateOrgpoDto } from './dto/update-orgpo.dto';
import { SearchOrgpoDto } from './dto/search-orgpo.dto';
import { Orgpos } from './entities/orgpos.entity';

@Injectable()
export class OrgposService {
  constructor(
    @InjectRepository(Orgpos, 'webformConnection')
    private readonly orgpos: Repository<Orgpos>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  async getOrgPos(dto: SearchOrgpoDto, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager.getRepository(Orgpos) : this.orgpos;
    return repo.find({
      where: dto,
      relations: ['EMPINFO'],
      order: {
        VEMPNO: 'ASC',
      },
    });
  }
}