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
    @InjectRepository(Orgpos, 'amecConnection')
    private readonly orgpos: Repository<Orgpos>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}
  create(createOrgpoDto: CreateOrgpoDto) {
    return 'This action adds a new orgpo';
  }

  findAll() {
    return `This action returns all orgpos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orgpo`;
  }

  update(id: number, updateOrgpoDto: UpdateOrgpoDto) {
    return `This action updates a #${id} orgpo`;
  }

  remove(id: number) {
    return `This action removes a #${id} orgpo`;
  }

  async getOrgPos(dto: SearchOrgpoDto, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager.getRepository(Orgpos) : this.orgpos;
    return repo.find({
      where: dto,
      order: {
        VEMPNO: 'ASC',
      },
    });
  }
}
