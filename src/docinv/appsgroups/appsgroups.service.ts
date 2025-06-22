import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appsgroup } from './entities/appsgroup.entity';

@Injectable()
export class AppsgroupsService {
  constructor(
    @InjectRepository(Appsgroup, 'amecConnection')
    private readonly amecgroupRepo: Repository<Appsgroup>,
  ) {}

  async findGroup(id: number, apps: number) {
    const data = await this.amecgroupRepo.findOne({
      where: {
        GROUP_ID: id,
        PROGRAM: apps,
      },
    });
    return data;
  }
}
