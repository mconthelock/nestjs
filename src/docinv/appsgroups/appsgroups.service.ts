import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appsgroup } from './entities/appsgroup.entity';
import { CreateAppsgroupDto } from './dto/create-appsgroup.dto';

@Injectable()
export class AppsgroupsService {
  constructor(
    @InjectRepository(Appsgroup, 'docinvConnection')
    private readonly gps: Repository<Appsgroup>,
  ) {}

  async findGroup(id: number, app: number) {
    return this.gps.findOne({
      where: {
        GROUP_ID: id,
        PROGRAM: app,
      },
    });
  }

  async findAll(id: number) {
    return this.gps.find({ where: { PROGRAM: id } });
  }

  async create(data: CreateAppsgroupDto) {
    const group = this.gps.create(data);
    return this.gps.save(group);
  }

  async update(program: number, id: number, data: CreateAppsgroupDto) {
    const groups = await this.gps.findOneBy({ GROUP_ID: id, PROGRAM: program });
    if (!groups) {
      throw new NotFoundException(
        `Group with id ${id} on program id ${program} not found`,
      );
    }
    Object.assign(groups, data);
    return await this.gps.save(groups);
  }

  async remove(app: number, id: number) {
    return this.gps.delete({ GROUP_ID: id, PROGRAM: app });
  }
}
