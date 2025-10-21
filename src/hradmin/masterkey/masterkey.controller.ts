import {
  Body,
  Controller,
  Get,
  Param,
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
      throw new UnauthorizedException('You nave no authorization 1');
    const isValid = await this.keys.verify(users, body.pin);
    if (!isValid)
      throw new UnauthorizedException('You nave no authorization 2');

    //Create Cookie for JWT Guards
    response.cookie(`hrmaster`, isValid, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return;
  }
}
