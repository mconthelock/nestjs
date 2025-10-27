import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { PromoteService } from './promote.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('hradmin/promote')
export class PromoteController {
  constructor(private readonly docs: PromoteService) {}

  @Post('all')
  @UseGuards(AuthGuard('key'))
  findAll(@Request() req, @Body() body: any) {
    return this.docs.findAll(req.user.user, body);
  }

  @Post('id')
  @UseGuards(AuthGuard('key'))
  findById(@Request() req, @Body() body: any) {
    return this.docs.findById(req.user.user, body);
  }
}
