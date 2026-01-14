import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RqffrmService } from './rqffrm.service';
import { CreateRqffrmDto } from './dto/create-rqffrm.dto';
import { UpdateRqffrmDto } from './dto/update-rqffrm.dto';
import { FormDto } from '../form/dto/form.dto';

@Controller('rqffrm')
export class RqffrmController {
  constructor(private readonly rqffrmService: RqffrmService) {}

  @Post('data')
  async getData(@Body() dto: FormDto) {
    return this.rqffrmService.getData(dto);
  }
}
