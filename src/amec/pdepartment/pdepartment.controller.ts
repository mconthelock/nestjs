import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PdepartmentService } from './pdepartment.service';
import { CreatePdepartmentDto } from './dto/create-pdepartment.dto';
import { UpdatePdepartmentDto } from './dto/update-pdepartment.dto';

@Controller('amec/department')
export class PdepartmentController {
  constructor(private readonly pdepartmentService: PdepartmentService) {}

  @Post()
  create(@Body() createPdepartmentDto: CreatePdepartmentDto) {
    return this.pdepartmentService.create(createPdepartmentDto);
  }

  @Get()
  findAll() {
    return this.pdepartmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdepartmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePdepartmentDto: UpdatePdepartmentDto,
  ) {
    return this.pdepartmentService.update(+id, updatePdepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdepartmentService.remove(+id);
  }
}
