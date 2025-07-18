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

@Controller('sp/control')
export class InquiryControlController {
  constructor(private readonly ctrl: InquiryControlService) {}

  @Get()
  findAll() {
    return this.ctrl.findAll();
  }
}
