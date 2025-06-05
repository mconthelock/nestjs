import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appsgroup } from './entities/appsgroup.entity';
import { CreateAppsgroupDto } from './dto/create-appsgroup.dto';
import { UpdateAppsgroupDto } from './dto/update-appsgroup.dto';

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
    return data == null ? {} : data;
  }

  create(createAppsgroupDto: CreateAppsgroupDto) {
    return 'This action adds a new appsgroup';
  }

  findAll() {
    return `This action returns all appsgroups`;
  }

  update(id: number, updateAppsgroupDto: UpdateAppsgroupDto) {
    return `This action updates a #${id} appsgroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} appsgroup`;
  }
}
