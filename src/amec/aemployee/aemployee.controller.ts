import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AemployeeService } from './aemployee.service';
import { CreateAemployeeDto } from './dto/create-aemployee.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('amec/employee')
export class AemployeeController {
  constructor(private readonly aemployeeService: AemployeeService) {}

  @Post()
  create(@Body() createAemployeeDto: CreateAemployeeDto) {
    return this.aemployeeService.create(createAemployeeDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.aemployeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aemployeeService.findOne(id);
  }

  @Get(':id')
  findOneBySLogin(@Param('id') id: string) {
    return this.aemployeeService.findOneBySLogin(id);
  }
}
