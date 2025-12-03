import { Body, Controller, Get, Post } from '@nestjs/common';
import { InquiryControlService } from './inquiry-control.service';

import { UpdateControllerDto } from './dto/update-controller.dto';

@Controller('sp/controler')
export class InquiryControlController {
  constructor(private readonly ctrl: InquiryControlService) {}

  @Get()
  findAll() {
    return this.ctrl.findAll();
  }

  @Post('update')
  update(@Body() updateDto: UpdateControllerDto) {
    return this.ctrl.update(updateDto);
  }
}
