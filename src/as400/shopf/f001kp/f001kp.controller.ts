import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { F001kpService } from './f001kp.service';
import { CreateF001kpDto } from './dto/create-f001kp.dto';
import { UpdateF001kpDto } from './dto/update-f001kp.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('f001kp')
export class F001kpController {
  constructor(private readonly f01: F001kpService) {}

  @Get('')
  findOne() {
    return this.f01.findOne();
  }
}
