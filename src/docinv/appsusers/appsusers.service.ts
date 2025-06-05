import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../../amec/users/users.service';
import { ApplicationService } from '../application/application.service';
import { Appsuser } from './entities/appsuser.entity';
// import { CreateAppsuserDto } from './dto/create-appsuser.dto';
// import { UpdateAppsuserDto } from './dto/update-appsuser.dto';

@Injectable()
export class AppsusersService {
  constructor(
    @InjectRepository(Appsuser, 'amecConnection')
    private readonly repo: Repository<Appsuser>,
    private readonly emps: UsersService,
    private readonly apps: ApplicationService,
  ) {}

  async verifyLogin(useremp: string, program: number) {
    const application = await this.apps.getAppsByID(program);
    if (!application) return null;
    const user = await this.repo.findOne({
      where: { USERS_ID: useremp, PROGRAM: program },
    });
    //Need register apps
    if (!user && application.APP_LOGIN == '1') return null;
    const emp = await this.emps.findEmp(useremp);
    const result = {
      appid: application.APP_ID,
      appname: application.APP_NAME,
      group: !user ? 0 : user.USERS_GROUP,
      userid: emp.SEMPNO,
      username: emp.SNAME,
      useremail: emp.SRECMAIL,
      usersseccode: emp.SSECCODE,
      userssec: emp.SSEC,
      usersdepcode: emp.SDEPCODE,
      usersdept: emp.SDEPT,
      usersdivcode: emp.SDIVCODE,
      usersdiv: emp.SDIV,
      usersposcode: emp.SPOSCODE,
      usersposname: emp.SPOSNAME,
    };
    return result;
  }

  //   create(createAppsuserDto: CreateAppsuserDto) {
  //     return 'This action adds a new appsuser';
  //   }

  //   findAll() {
  //     return `This action returns all appsusers`;
  //   }

  //   update(id: number, updateAppsuserDto: UpdateAppsuserDto) {
  //     return `This action updates a #${id} appsuser`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} appsuser`;
  //   }
}
