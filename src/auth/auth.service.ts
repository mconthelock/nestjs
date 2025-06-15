// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UsersService } from '../amec/users/users.service';
import { AppsusersService } from '../docinv/appsusers/appsusers.service';
import { AppsmenuusersService } from '../docinv/appsmenuusers/appsmenuusers.service';
import { AccesslogService } from '../docinv/accesslog/accesslog.service';

interface logData {
  loguser: string;
  logip: string;
  logstatus: number;
  logprogram: number;
  logmsg: string;
}

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private Appsuser: AppsusersService,
    private Appsmenu: AppsmenuusersService,
    private logs: AccesslogService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string, apps: number, ip: string) {
    const log: logData = {
      loguser: username,
      logip: ip,
      logstatus: 0,
      logprogram: apps,
      logmsg: 'Username is not found',
    };
    const user = await this.UsersService.findEmp(username);
    if (!user || user.CSTATUS == '0') {
      this.logs.create(log);
      throw new UnauthorizedException('You nave no authorization');
    }

    const md5Hash = crypto.createHash('md5').update(pass).digest('hex');
    if (md5Hash != user.SPASSWORD1) {
      log.logmsg = 'Password is mismatch';
      this.logs.create(log);
      throw new UnauthorizedException('You nave no authorization');
    }
    const validUser = await this.Appsuser.verifyLogin(username, apps);
    if (!validUser) {
      log.logmsg = 'User has no permission';
      this.logs.create(log);
      throw new UnauthorizedException('You nave no authorization');
    }
    const auth = await this.getAuthenlist(apps, validUser.group.GROUP_ID);
    log.logstatus = 1;
    log.logmsg = 'Logging in successful';
    this.logs.create(log);
    return {
      payload: {
        users: validUser.appuser.SEMPNO,
        group: validUser.group.GROUP_ID,
        apps: validUser.application.APP_ID,
        location: validUser.application.APP_LOCATION,
      },
      apps: validUser.application,
      appuser: validUser.appuser,
      appgroup: validUser.group,
      auth: auth,
    };
  }

  async getAuthenlist(program: number, group: number) {
    const menulist = await this.Appsmenu.getUserMenu(program, group);
    let mainmenu = [];
    menulist.find((val) => {
      if (val.Appsmenu != null && val.Appsmenu.MENU_TYPE == 1) {
        mainmenu.push(val.Appsmenu);
      }
    });
    mainmenu.find((val) => {
      menulist.map((mn) => {
        if (mn.Appsmenu.MENU_TOP == val.MENU_ID && mn.Appsmenu.MENU_TYPE == 2) {
          if (!val.submenu) {
            val.submenu = [];
          }
          val.submenu.push(mn.Appsmenu);
        }
      });
    });
    return mainmenu;
  }

  async login(user: any) {
    const payload = {
      user: user.payloadr,
      sub: user.sempno,
    };
    return {
      access_token: this.jwtService.sign(payload), //expiresIn: 3600,
      info: user,
    };
  }
}
