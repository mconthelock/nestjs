import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateMfgEdrTargetMasterDto } from './dto/create_mfg_edr_target_master.dto';
import { SearchMfgEdrTargetMasterDto } from './dto/search_mfg_edr_target_master.dto';
import { UpdateMfgEdrTargetMasterDto } from './dto/update_mfg_edr_target_master.dto';
import { MfgEdrTargetMasterService } from './mfg_edr_target_master.service';

@Controller('mfg-edr/target-master')
export class MfgEdrTargetMasterController {
  constructor(
    private readonly mfgEdrTargetMasterService: MfgEdrTargetMasterService,
  ) {}

  @Post()
  create(@Body() dto: CreateMfgEdrTargetMasterDto) {
    return this.mfgEdrTargetMasterService.create(dto);
  }

  @Get()
  findAll() {
    return this.mfgEdrTargetMasterService.findAll();
  }

  @Post('search')
  search(@Body() dto: SearchMfgEdrTargetMasterDto) {
    return this.mfgEdrTargetMasterService.search(dto);
  }

  @Get(':FYEAR/:SSECCODE')
  findOne(
    @Param('FYEAR', ParseIntPipe) FYEAR: number,
    @Param('SSECCODE') SSECCODE: string,
  ) {
    return this.mfgEdrTargetMasterService.findOne(FYEAR, SSECCODE);
  }

  @Patch(':FYEAR/:SSECCODE')
  update(
    @Param('FYEAR', ParseIntPipe) FYEAR: number,
    @Param('SSECCODE') SSECCODE: string,
    @Body() dto: UpdateMfgEdrTargetMasterDto,
  ) {
    return this.mfgEdrTargetMasterService.update(
      FYEAR,
      SSECCODE,
      dto,
    );
  }

  @Delete(':FYEAR/:SSECCODE')
  remove(
    @Param('FYEAR', ParseIntPipe) FYEAR: number,
    @Param('SSECCODE') SSECCODE: string,
  ) {
    return this.mfgEdrTargetMasterService.remove(
      FYEAR,
      SSECCODE,
    );
  }
}