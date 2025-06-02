import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AemployeeService } from './aemployee.service';
import { CreateAemployeeDto } from './dto/create-aemployee.dto';
import { UpdateAemployeeDto } from './dto/update-aemployee.dto';

@Controller('amec/employee')
export class AemployeeController {
  constructor(private readonly aemployeeService: AemployeeService) {}

  @Post()
  create(@Body() createAemployeeDto: CreateAemployeeDto) {
    return this.aemployeeService.create(createAemployeeDto);
  }

  @Get()
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
