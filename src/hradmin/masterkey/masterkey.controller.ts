import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { MasterkeyService } from './masterkey.service';

@Controller('hradmin/masterkey')
export class MasterkeyController {
  constructor(private readonly keys: MasterkeyService) {}

  @Post('verified')
  @UseGuards(AuthGuard('jwt'))
  async verified(
    @Request() req,
    @Body() body: { pin: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { users, group, apps } = req.user.user;
    if (!(group === 2 && apps === 20))
      throw new UnauthorizedException('You nave no authorization');

    const isValid = await this.keys.verify(users, body.pin);
    if (!isValid) throw new UnauthorizedException('You nave no authorization');

    if (isValid.status === 'expired') {
      return { status: 'expired' };
    }
    //Create Cookie for Key Guards
    response.cookie(process.env.KEY_COOKIE_NAME, isValid.token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return;
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Request() req) {
    const { users, group, apps } = req.user.user;
    if (!(group === 2 && apps === 20))
      throw new UnauthorizedException('You nave no authorization');
    const data = await this.keys.findAll();
    return data.map((item) => {
      const { KEY_CODE, ...rest } = item;
      return rest;
    });
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Body() body: { pin: string; newpin: string }) {
    const { users, group, apps } = req.user.user;
    if (!(group === 2 && apps === 20))
      throw new UnauthorizedException('You nave no authorization');

    const isValid = await this.keys.verify(users, body.pin);
    if (!isValid) throw new UnauthorizedException('You nave no authorization');

    return await this.keys.updateMasterKey(isValid.token, users, body.newpin);
  }

  @Post('create')
  @UseGuards(AuthGuard('key'))
  async create(@Request() req, @Body() body: { empno: string; type: string }) {
    return await this.keys.createMasterKey(
      req.user.user,
      body.empno,
      body.type,
    );
  }
}
