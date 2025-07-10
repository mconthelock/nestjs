import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Q90010p2Service } from './q90010p2.service';
import { CreateQ90010p2Dto } from './dto/create-q90010p2.dto';
import { UpdateQ90010p2Dto } from './dto/update-q90010p2.dto';

@Controller('q90010p2')
export class Q90010p2Controller {
  constructor(private readonly q90010p2Service: Q90010p2Service) {}

  @Post()
  create(@Body() createQ90010p2Dto: CreateQ90010p2Dto) {
    return this.q90010p2Service.create(createQ90010p2Dto);
  }

  @Get()
  findAll() {
    return this.q90010p2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.q90010p2Service.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQ90010p2Dto: UpdateQ90010p2Dto,
  ) {
    return this.q90010p2Service.update(+id, updateQ90010p2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.q90010p2Service.remove(+id);
  }
}
