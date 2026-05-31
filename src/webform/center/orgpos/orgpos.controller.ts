import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrgposService } from './orgpos.service';
import { CreateOrgpoDto } from './dto/create-orgpo.dto';
import { UpdateOrgpoDto } from './dto/update-orgpo.dto';
import { SearchOrgpoDto } from './dto/search-orgpo.dto';

@Controller('orgpos')
export class OrgposController {
  constructor(private readonly orgposService: OrgposService) {}

  @Post('getOrgPos')
  async getOrgPos(@Body() dto: SearchOrgpoDto) {
    return await this.orgposService.getOrgPos(dto);
  }
}
