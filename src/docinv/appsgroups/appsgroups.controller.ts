import { Controller, Get, Param } from '@nestjs/common';
import { AppsgroupsService } from './appsgroups.service';

@Controller('docinv/appsgroups')
export class AppsgroupsController {
  constructor(private readonly appsgroupsService: AppsgroupsService) {}

  @Get(':id/:apps')
  findOne(@Param('id') id: string, @Param('apps') apps: string) {
    return this.appsgroupsService.findGroup(+id, +apps);
  }
}
