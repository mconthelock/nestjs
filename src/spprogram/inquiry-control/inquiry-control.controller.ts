import { Controller, Get } from '@nestjs/common';
import { InquiryControlService } from './inquiry-control.service';

@Controller('sp/controler')
export class InquiryControlController {
  constructor(private readonly ctrl: InquiryControlService) {}

  @Get()
  findAll() {
    return this.ctrl.findAll();
  }
}
