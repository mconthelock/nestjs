import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QainsOAService } from './qains_operator_auditor.service';
import { CreateQainsOADto } from './dto/create-qains_operator_auditor.dto';
import { UpdateQainsOADto } from './dto/update-qains_operator_auditor.dto';
import { SearchQainsOADto } from './dto/search-qains_operator_auditor.dto';

@Controller('qaform/qa-ins/OA')
export class QainsOAController {
  constructor(private readonly QainsOAService: QainsOAService) {}

  @Post('/insert')
  async createQainsOA(@Body() dto: CreateQainsOADto) {
    return this.QainsOAService.createQainsOA(dto);
  }

  @Post('searchQainsOA')
  async searchQainsOA(@Body() dto: SearchQainsOADto) {
    return this.QainsOAService.searchQainsOA(dto);
  }

  @Post('findOneQainsOA')
  async findOne(@Body() dto: SearchQainsOADto) {
    return this.QainsOAService.findOne(dto);
  }
}
