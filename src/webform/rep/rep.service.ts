import { Injectable } from '@nestjs/common';
import { CreateRepDto } from './dto/create-rep.dto';
import { UpdateRepDto } from './dto/update-rep.dto';
import { SearchRepDto } from './dto/search-rep.dto';
import { Rep } from './entities/rep.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';


@Injectable()
export class RepService {
  constructor(
    @InjectRepository(Rep, 'amecConnection')
    private readonly repRepo: Repository<Rep>,

    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}
  create(createRepDto: CreateRepDto) {
    return 'This action adds a new rep';
  }

  findAll() {
    return `This action returns all rep`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rep`;
  }

  update(id: number, updateRepDto: UpdateRepDto) {
    return `This action updates a #${id} rep`;
  }

  remove(id: number) {
    return `This action removes a #${id} rep`;
  }

  getRep(dto: SearchRepDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(Rep)
      : this.repRepo;
    return repo.find({ where: dto });
  }

  async getRepresent(dto: SearchRepDto, queryRunner?: QueryRunner) {
    const data = queryRunner
      ? await this.getRep(dto, queryRunner)
      : await this.getRep(dto);
    let represent = dto.VEMPNO;
    if (Array.isArray(data) && data.length > 0 && data[0]?.VREPNO !== '') {
      represent = data[0].VREPNO;
    }
    return represent;
  }
}
