import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { AppsgroupsService } from './appsgroups.service';
import { CreateAppsgroupDto } from './dto/create-appsgroup.dto';

@Controller('docinv/groups')
export class AppsgroupsController {
  constructor(private readonly gps: AppsgroupsService) {}

  @Get(':apps')
  findOne(@Param('apps') apps: number) {
    return this.gps.findAll(+apps);
  }

  @Post()
  async create(@Body() data: CreateAppsgroupDto) {
    const group = await this.gps.findAll(data.PROGRAM);
    let id = 0;
    if (group) {
      const maxId = Math.max(...group.map((item) => item.GROUP_ID));
      id = maxId + 1;
    }
    data = { ...data, GROUP_ID: id };
    return this.gps.create(data);
  }

  @Patch(':app/:id')
  async update(
    @Param('app') app: number,
    @Param('id') id: number,
    @Body() data: CreateAppsgroupDto,
  ) {
    return this.gps.update(app, id, data);
  }

  @Delete(':app/:id')
  delete(@Param('app') app: number, @Param('id') id: number) {
    return this.gps.remove(app, id);
  }
}
