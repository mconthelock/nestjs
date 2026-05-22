import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PtermcodeService } from './ptermcode.service';
import { CreatePtermcodeDto } from './dto/create-ptermcode.dto';
import { UpdatePtermcodeDto } from './dto/update-ptermcode.dto';

@Controller('amec/ptermcode')
export class PtermcodeController {
  constructor(private readonly ptermcodeService: PtermcodeService) {}

  @Get('ptermcode')
  findTermcode() {
    return this.ptermcodeService.findTermcode();
  }

}
