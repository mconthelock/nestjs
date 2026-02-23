import { Controller, Post, Body, Get } from '@nestjs/common';
import { InquiryGroupService } from './inquiry-group.service';
import { createGroupDto } from './dto/create.dto';
import { searchGroupDto } from './dto/search.dto';
import { inqGroupDataDto } from './dto/update-data.dto';

@Controller('sp/group')
export class InquiryGroupController {
  constructor(private readonly group: InquiryGroupService) {}

  @Post('create')
  async create(@Body() createDto: createGroupDto) {
    return await this.group.create(createDto);
  }

  @Post('search')
  async search(@Body() searchDto: searchGroupDto) {
    return await this.group.search(searchDto);
  }

  @Post('update')
  async update(@Body() req: inqGroupDataDto) {
    console.log(req.data);

    return await this.group.update({
      data: req.data,
      condition: req.condition,
    });
  }
}
