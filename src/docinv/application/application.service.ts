import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application, 'docinvConnection')
    private readonly apps: Repository<Application>,
  ) {}

  getAppsByID(id: number) {
    return this.apps.findOne({ where: { APP_ID: id } });
  }

  findAll() {
    return this.apps.find();
  }

  create(data: CreateApplicationDto) {
    const app = this.apps.create(data);
    return this.apps.save(app);
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {
    const app = await this.apps.findOneBy({ APP_ID: id });
    if (!app) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    Object.assign(app, updateApplicationDto);
    return await this.apps.save(app);
  }
}
