import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GpRbService} from './gp-rb.service';
import { CreateGpRbDto } from './dto/create-gp-rb.dto';
import { UpdateGpRbDto } from './dto/update-gp-rb.dto';

@Controller('gpform/gp-rb')
export class GpRbController {
  constructor(private readonly gpRbServicee: GpRbService) {}

  @Get()
  findAll(){
    return this.gpRbServicee.findAll();
  }
}
 