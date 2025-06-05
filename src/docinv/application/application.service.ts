import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application, 'amecConnection')
    private readonly appRepository: Repository<Application>,
  ) {}

  getAppsByID(id: number) {
    return this.appRepository.findOne({ where: { APP_ID: id } });
  }

  findAll() {
    return this.appRepository.find();
  }

  create(createApplicationDto: CreateApplicationDto) {
    return 'This action adds a new application';
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return `This action updates a #${id} application`;
  }

  remove(id: number) {
    return `This action removes a #${id} application`;
  }
}
