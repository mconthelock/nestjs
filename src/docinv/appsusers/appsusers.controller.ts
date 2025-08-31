import {
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { AppsusersService } from './appsusers.service';
import { CreateAppsuserDto } from './dto/create-appsuser.dto';

@Controller('docinv/appsusers')
export class AppsusersController {
  constructor(private readonly users: AppsusersService) {}

  @Get('/user/:id')
  async getUserApp(@Param('id') id: string) {
    return this.users.getUserApp(id);
  }

  @Get('/program/:id')
  async getAllUserApp(@Param('id') id: number) {
    return this.users.getAllUserApp(id);
  }

  @Post()
  async create(@Body() data: CreateAppsuserDto) {
    return this.users.create(data);
  }

  @Patch(':app/:id')
  async update(
    @Param('app') app: number,
    @Param('id') id: string,
    @Body() data: CreateAppsuserDto,
  ) {
    return this.users.update(app, id, data);
  }

  @Delete(':app/:id')
  remove(@Param('app') app: number, @Param('id') id: string) {
    return this.users.remove(app, id);
  }
}
