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
import { SearchDto } from './dto/search.dto';

@Controller('amec/department')
export class PdepartmentController {
  constructor(private readonly pdepartmentService: PdepartmentService) {}

 @Get()
  getDepartmentAll() {
    return this.pdepartmentService.getDepartmentAll();
  }

  @Get(':code')
  getDepartmentByCode(@Param('code') code: string) {
    return this.pdepartmentService.getDepartmentByCode(code);
  }

  @Post('getDepartment')
  async getDepartment(@Body() searchDto: SearchDto) {
    return this.pdepartmentService.getDepartment(searchDto);
  }
  

}
