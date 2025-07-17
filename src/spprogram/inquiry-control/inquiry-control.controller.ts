import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InquiryControlService } from './inquiry-control.service';
import { CreateInquiryControlDto } from './dto/create-inquiry-control.dto';
import { UpdateInquiryControlDto } from './dto/update-inquiry-control.dto';

@Controller('sp/control')
export class InquiryControlController {
  constructor(private readonly ctrl: InquiryControlService) {}

  @Get()
  findAll() {
    return this.ctrl.findAll();
  }
}
