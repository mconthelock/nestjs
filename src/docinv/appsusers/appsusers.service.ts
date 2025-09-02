import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//Service
import { UsersService } from '../../amec/users/users.service';
import { ApplicationService } from '../application/application.service';
import { AppsgroupsService } from '../appsgroups/appsgroups.service';
import { AccesslogService } from '../accesslog/accesslog.service';
import { Appsuser } from './entities/appsuser.entity';

import { CreateAppsuserDto } from './dto/create-appsuser.dto';

interface logData {
  loguser: string;
  logip: string;
  logstatus: number;
  logprogram: number;
  logmsg: string;
}

@Injectable()
export class AppsusersService {
  constructor(
    @InjectRepository(Appsuser, 'amecConnection')
    private readonly appuser: Repository<Appsuser>,
    private readonly emps: UsersService,
    private readonly apps: ApplicationService,
    private readonly grps: AppsgroupsService,
    private readonly log: AccesslogService,
  ) {}

  async verifyLogin(useremp: string, program: number) {
    const application = await this.apps.getAppsByID(program);
    if (!application) return null;
    const user = await this.appuser.findOne({
      where: { USERS_ID: useremp, PROGRAM: program },
      relations: ['appsgroups'],
    });
    if (!user && application.APP_LOGIN == '1') return null;

    const usergroup = !user ? 0 : user.USERS_GROUP;
    const group = await this.grps.findGroup(usergroup, program);

    if (group == null || group.GROUP_STATUS != 1) return null;
    return { application, group };
  }

  async getUserApp(user: string) {
    return await this.appuser.find({
      where: { USERS_ID: user },
      relations: ['application', 'appsgroups'],
    });
  }

  async getAllUserApp(id: number) {
    return this.appuser.find({
      where: { PROGRAM: id },
      relations: ['appsgroups'],
      order: { USERS_GROUP: 'asc' },
    });
  }

  async create(data: CreateAppsuserDto) {
    const user = this.appuser.create(data);
    return this.appuser.save(user);
  }

  async update(app: number, id: string, data: CreateAppsuserDto) {
    const list = await this.appuser.findOneBy({ USERS_ID: id, PROGRAM: app });
    if (!list) {
      throw new NotFoundException(`User ${id} is not found`);
    }
    Object.assign(list, data);
    return await this.appuser.save(list);
  }

  async remove(app: number, id: string) {
    return this.appuser.delete({ USERS_ID: id, PROGRAM: app });
  }
}
