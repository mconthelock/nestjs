import { Controller, Get, Param } from '@nestjs/common';
import { DetailService } from './detail.service';

@Controller('idtag/detail')
export class DetailController {
  constructor(private readonly tags: DetailService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tags.findOne(id);
  }
}
