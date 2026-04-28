import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { GpRbService} from './gp-rb.service';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { getClientIP } from 'src/common/utils/ip.utils';
import { Request } from "express";


@Controller('gpform/gp-rb')
export class GpRbController {
  constructor(private readonly gpRbServicee: GpRbService) {}

  @Get()
  findAll(){
    return this.gpRbServicee.findAll();
  }

  @Post()
  @UseTransaction('webformConnection')
  create(@Body() dto:CreateGpRbDto,@Req() req:Request) {
    const ip = getClientIP(req)
    return this.gpRbServicee.create(dto,ip);
  }
}
 