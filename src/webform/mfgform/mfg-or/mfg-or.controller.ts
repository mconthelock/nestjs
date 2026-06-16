import { Body, Controller, Post } from '@nestjs/common';
import { MfgOrService } from './mfg-or.service';
import { CreateMfgOrDto } from './dto/create-mfg-or.dto';
import { GetMfgOrDto } from './dto/get-mfg-or.dto';

@Controller('mfg-or')
export class MfgOrController {
  constructor(private readonly service: MfgOrService) {}

  @Post('create')
  create(@Body() dto: CreateMfgOrDto) {
    return this.service.createorform(dto);
  }

  @Post('getdetail-mfg-or')
  getMfgOr(@Body() dto: GetMfgOrDto) {
    return this.service.getMfgOr(dto);
  }

  @Post('generate-or-no')
  generateOrNo(@Body() dto: GetMfgOrDto & { FORMNO?: string }) {
    return this.service.generateOrNo(dto);
  }

  @Post('update-revise-center')
  updateReviseCenter(@Body() dto: GetMfgOrDto & { FORMNO?: string }) {
    return this.service.updateMfgOrCenterForRevise(dto);
  }

}