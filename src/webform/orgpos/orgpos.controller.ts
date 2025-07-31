import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrgposService } from './orgpos.service';
import { CreateOrgpoDto } from './dto/create-orgpo.dto';
import { UpdateOrgpoDto } from './dto/update-orgpo.dto';

@Controller('orgpos')
export class OrgposController {
  constructor(private readonly orgposService: OrgposService) {}

  @Post()
  create(@Body() createOrgpoDto: CreateOrgpoDto) {
    return this.orgposService.create(createOrgpoDto);
  }

  @Get()
  findAll() {
    return this.orgposService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgposService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgpoDto: UpdateOrgpoDto) {
    return this.orgposService.update(+id, updateOrgpoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgposService.remove(+id);
  }
}
