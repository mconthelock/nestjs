import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JopMarReqService } from './jop-mar-req.service';
import { CreateJopMarReqDto } from './dto/create-jop-mar-req.dto';
import { UpdateJopMarReqDto } from './dto/update-jop-mar-req.dto';

@Controller('joborder/request')
export class JopMarReqController {
  constructor(
    private readonly jopMarReqService: JopMarReqService,
  ) {}

  @Post('setRequestDate')
  async create(@Body() dto: CreateJopMarReqDto) {
      return await this.jopMarReqService.create(dto);
  }

}
