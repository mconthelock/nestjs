import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SequenceOrgService } from './sequence-org.service';
import { CreateSequenceOrgDto } from './dto/create-sequence-org.dto';
import { UpdateSequenceOrgDto } from './dto/update-sequence-org.dto';

@Controller('sequence-org')
export class SequenceOrgController {
  constructor(private readonly sequenceOrgService: SequenceOrgService) {}

  @Get()
  findAll() {
    return this.sequenceOrgService.findAll();
  }

  @Get('manager/:empno')
  findManager(@Param('empno') empno: string) {
    return this.sequenceOrgService.getManager(empno);
  }

  @Get('subordinates/:empno')
  findSubordinates(@Param('empno') empno: string) {
    return this.sequenceOrgService.getSubordinates(empno);
  }
}
