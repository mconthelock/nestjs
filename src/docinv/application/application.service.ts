import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AppsgroupsService } from '../appsgroups/appsgroups.service';

interface groupData {
  GROUP_ID: number;
  GROUP_DESC: string;
  GROUP_CODE: string;
  GROUP_STATUS: number;
  GROUP_HOME?: string;
  GROUP_REMARK?: string;
  UPDATE_DATE: Date;
  PROGRAM: number;
}

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application, 'docinvConnection')
    private readonly apps: Repository<Application>,

    private grp: AppsgroupsService,
  ) {}

  getAppsByID(id: number) {
    return this.apps.findOne({ where: { APP_ID: id } });
  }

  findAll() {
    return this.apps.find();
  }

  async create(data: CreateApplicationDto) {
    const app = await this.apps.save(data);
    if (data.APP_LOGIN == '0') {
      const grngroup: groupData = {
        GROUP_ID: 0,
        GROUP_DESC: 'General Users',
        GROUP_CODE: 'GRN',
        GROUP_STATUS: 1,
        UPDATE_DATE: new Date(),
        PROGRAM: app.APP_ID,
      };
      await this.grp.create(grngroup);
    }
    return await this.apps.findOne({ where: { APP_ID: app.APP_ID } });
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
