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
import { SearchDepartmentDto } from './dto/search-department.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('AMEC Department')
@Controller('amec/department')
export class PdepartmentController {
  constructor(private readonly pdepartmentService: PdepartmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  getDepartmentAll() {
    return this.pdepartmentService.getDepartmentAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get department by code' })
  @ApiParam({ name: 'code', example: '050601', required: true })
  getDepartmentByCode(@Param('code') code: string) {
    return this.pdepartmentService.getDepartmentByCode(code);
  }

  @Post('getDepartment')
  @ApiOperation({ summary: 'Get departments' })
  async getDepartment(@Body() searchDto: SearchDepartmentDto) {
    return this.pdepartmentService.getDepartment(searchDto);
  }
}
