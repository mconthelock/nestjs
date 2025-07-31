import { Controller, Post, Body } from '@nestjs/common';
import { InquiryGroupService } from './inquiry-group.service';
import { createDto } from './dto/create.dto';
import { searchDto } from './dto/search.dto';

@Controller('sp/group')
export class InquiryGroupController {
  constructor(private readonly group: InquiryGroupService) {}

  @Post('create')
  async create(@Body() createDto: createDto) {
    return await this.group.create(createDto);
  }

  @Post('search')
  async search(@Body() searchDto: searchDto) {
    return await this.group.search(searchDto);
  }
}
