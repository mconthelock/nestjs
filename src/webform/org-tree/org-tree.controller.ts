import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrgTreeService } from './org-tree.service';
import { CreateOrgTreeDto } from './dto/create-org-tree.dto';
import { UpdateOrgTreeDto } from './dto/update-org-tree.dto';

@Controller('org-tree')
export class OrgTreeController {
  constructor(private readonly orgTreeService: OrgTreeService) {}

  @Post()
  create(@Body() createOrgTreeDto: CreateOrgTreeDto) {
    return this.orgTreeService.create(createOrgTreeDto);
  }

  @Get()
  findAll() {
    return this.orgTreeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgTreeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgTreeDto: UpdateOrgTreeDto) {
    return this.orgTreeService.update(+id, updateOrgTreeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgTreeService.remove(+id);
  }
}
