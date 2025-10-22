import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsTidService } from './is-tid.service';
import { CreateIsTidDto } from './dto/create-is-tid.dto';
import { UpdateIsTidDto } from './dto/update-is-tid.dto';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('isform/is-tid')
export class IsTidController {
  constructor(private readonly isTidService: IsTidService) {}

  @Post('getFormData')
  async getFormData(@Body() dto: FormDto) {
    return this.isTidService.getFormData(dto);
  }
}
